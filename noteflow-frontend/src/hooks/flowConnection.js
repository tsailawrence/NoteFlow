import sharedb from 'sharedb/lib/client';
import * as json1 from 'ot-json1';
import ReconnectingWebsocket from 'reconnecting-websocket';
import instance, { BASE_URL } from '../API/api';
import { type } from 'rich-text';
import { getRandomPicture } from './useApp';
import { allocateColor } from '../API/Colab';

sharedb.types.register(json1.type);

class FlowWebSocket {
  constructor(
    flowId,
    email,
    updateNodeAndEdge,
    subscribeToToolbar,
    updateMetaData,
  ) {
    this.subscribeToToolbar = subscribeToToolbar;
    this.updateMetaData = updateMetaData;
    this.lastUpdated = Date.now();
    this.email = email;
    this.mounted = {};
    this.mounted_list = {};
    this.mouseTracker = {};
    this.self = {
      xPort: 0,
      yPort: 0,
      x: 0,
      y: 0,
      left: 0,
      top: 0,
      width: 0,
      height: 0,
      zoom: 1,
    };
    this.mouseLastUpdated = Date.now();
    if (!flowId) return;
    this.nodeAndEdgeSub(flowId, updateNodeAndEdge);
    this.mouseMovementSub(flowId);

    // [{email: ..., name: ..., x: ..., y: ...}]
  }

  updateInfo(params) {
    this.self = {
      ...this.self,
      ...params,
    };
  }

  async receiveLocation(email) {
    /*
      我送的資料包括
      { x: canvasX, y: canvasY, xPort: x, yPort:y, zoom: zoom }
      我在 render 游標的時候, 我會先看一下自己的可視範圍到哪裡。
      可視範圍：
      x 的範圍：[xPort_mine, (xPort_mine + width) / zoom]
      y 的範圍：[yPort_mine, (yPort_mine + height) / zoom]

      對方點點：[(xPort_his + x_his) / zoom, (yPort_his + y_his) / zoom] 如果介在我的可視範圍裡面的話
      我就：
      1. 如果直接透過瀏覽器 render：render 一個紫色箭頭在 clientX, client Y 的地方
      2. 如果透過 React flow render：render 一個紫色箭頭在 canvasRect.left + xPort + (x/zoom), canvasRect.top + yPort + (y/zoom) 的地方
    */
    // 嘗試收自己的訊息，讓紅點點能夠 track 我，也不錯
    const background = document.querySelector('.NodePanel');
    if (!background) return;
    if (email in this.mouseTracker) {
      // let divElement = document.createElement('div');
      let divElement;
      if (!(email in this.mounted_list)) {
        this.mounted_list[email] = true;
        divElement = await FlowWebSocket.createInstance(email, 'mouse-dot');
        background.appendChild(divElement);
      }
      divElement = document.querySelector(`#mouse-dot-${email}`);

      const other = this.mouseTracker[email];

      if (!divElement || !other) return;

      const { xPort, yPort, left, top, width, height, zoom, x, y } = this.self;

      const myScope = {
        xMin: xPort / zoom - 100,
        xMax: (xPort + width) / zoom + 100,
        yMin: yPort / zoom - 100,
        yMax: (yPort + height) / zoom + 100,
      };

      const xOffset = other.xPort - xPort / zoom;
      const yOffset = other.yPort - yPort / zoom;

      const heInMyScope = {
        x: (other.x + xOffset) * zoom,
        y: (other.y + yOffset) * zoom,
      };

      // if (
      //   hisScope.x >= myScope.xMin &&
      //   hisScope.x <= myScope.xMax &&
      //   hisScope.y >= myScope.yMin &&
      //   hisScope.y <= myScope.yMax
      // ) {
      //   // 透過 jquery 應該可以直接呈現在螢幕上。
      //   divElement.style.left = `${(hisScope.x - myScope.xMin) * zoom}px`;
      //   divElement.style.top = `${(hisScope.y - myScope.yMin) * zoom}px`;
      // }

      if (
        heInMyScope.x >= myScope.xMin &&
        heInMyScope.x <= myScope.xMax &&
        heInMyScope.y >= myScope.yMin &&
        heInMyScope.y <= myScope.yMax
      ) {
        divElement.style.left = `${heInMyScope.x - 25}px`;
        divElement.style.top = `${heInMyScope.y - 25}px`;
      }
    }
  }

  static async createInstance(email, className) {
    let divElement = document.createElement('div');
    divElement.className = className;
    divElement.id = `${className}-${email}`;
    divElement.style.border = `${allocateColor(deconvert(email))} solid 2px`;

    const imgElement = document.createElement('img');
    imgElement.className = `${className}-img`;

    try {
      const res = await instance.get(
        `/user/get-photo-url?email=${deconvert(email)}`,
      );
      if (res.data) {
        imgElement.src = res.data.startsWith('http')
          ? res.data
          : `/api/fs/image/${res.data}`;
      } else {
        imgElement.src = getRandomPicture(deconvert(email));
      }
    } catch (e) {
      imgElement.src = getRandomPicture(deconvert(email));
    }
    divElement.appendChild(imgElement);

    return divElement;
  }

  mouseMovementSub(flowId) {
    // mouse
    // 這個會追蹤 mouse 並定期上傳其位置
    this.mouseSocket = new ReconnectingWebsocket(
      `wss://${BASE_URL}/ws/flow/mouse-sub?id=${flowId}`,
    );

    this.mouseSocket.addEventListener('message', (msg) => {
      const response = JSON.parse(msg.data.toString('utf-8'));
      if (response.type === 's') {
        this.updateMetaData(response.title);
      } else {
        const position = response;
        if (!position || !position.email) return;
        const email = convert(position.email);
        delete position.email;
        this.mouseTracker[email] = {
          ...position,
          lastUpdate: Date.now(),
        };
        if (email !== convert(this.email)) {
          this.receiveLocation(email);
        }

        this.subscribeToToolbar(this.mouseTracker, this.mounted);
      }
    });

    this.interval = setInterval(() => {
      this.subscribeToToolbar(this.mouseTracker, this.mounted);
    }, 2000);
  }

  // { x: canvasX, y: canvasY, xPort: x, yPort:y }
  sendLocation(params) {
    if (!this.mouseSocket) return;

    const currentTime = Date.now();
    if (currentTime - this.lastUpdated < 20) return;
    this.mouseLastUpdated = currentTime;

    this.mouseSocket.send(JSON.stringify(params));
  }

  nodeAndEdgeSub(flowId, updateData) {
    // sharedb
    this.socket = new ReconnectingWebsocket(
      `wss://${BASE_URL}/ws/flow?id=${flowId}`,
    );

    const collection = 'flow-sharedb';
    const connection = new sharedb.Connection(this.socket);
    const flow = connection.get(collection, flowId);
    flow.subscribe((e) => {
      if (e) throw e;
      this.flow = flow;
      this.flow.on('op', (op) => {
        this.lastOp = op;
        updateData(this.convertFlowData(this.flow.data));
      });

      updateData(this.convertFlowData(this.flow.data));
    });
  }

  close() {
    if (this.socket) {
      this.socket.close();
    }
    if (this.mouseSocket) {
      this.mouseSocket.close();
    }
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  editFlowTitle(title) {
    const op = [json1.replaceOp(['name'], true, title)].reduce(
      json1.type.compose,
      null,
    );
    this.flow.submitOp(op, (error) => {
      if (error) {
        this.flow.submitOp(op);
      }
    });
  }

  addComponent(component, type) {
    const op = [
      json1.insertOp(
        [type === 'node' ? 'nodes' : 'edges', component.id],
        component,
      ),
    ].reduce(json1.type.compose, null);
    this.flow.submitOp(op, (error) => {
      if (error) {
        this.flow.submitOp(op);
      }
    });
  }

  editComponent(param, type) {
    const currentTime = Date.now();
    if (currentTime - this.lastUpdated < 20) return;
    this.lastUpdated = currentTime;
    let op = [];
    let currentNode;
    switch (param[0].type) {
      case 'remove':
        op = [
          json1.removeOp([type === 'node' ? 'nodes' : 'edges', param[0].id]),
        ];
        if (type === 'node') {
          const edgeArr = Object.keys(this.flow.data['edges']);

          edgeArr.map((id) => {
            if (
              this.flow.data.edges[id].target === param[0].id ||
              this.flow.data.edges[id].source === param[0].id
            ) {
              op.push(json1.removeOp(['edges', id]));
            }
          });
        }
        op = op.reduce(json1.type.compose, null);

        break;
      case 'position':
        // 如果 dragging == false 就不做事
        if (type === 'edge') throw Error('窩看不懂');

        currentNode =
          this.flow.data[type === 'node' ? 'nodes' : 'edges'][param[0].id];

        currentNode.position = param[0].position
          ? param[0].position
          : currentNode.position;

        op = [
          json1.replaceOp(
            [type === 'node' ? 'nodes' : 'edges', param[0].id.toString()],
            true,
            currentNode,
          ),
        ].reduce(json1.type.compose, null);

        break;
      case 'title':
        if (type === 'edge') throw Error('看不懂');

        let node =
          this.flow.data[type === 'node' ? 'nodes' : 'edges'][param[0].id];
        node.data.label = param[0].label;

        op = [
          json1.replaceOp(
            [type === 'node' ? 'nodes' : 'edges', param[0].id.toString()],
            true,
            node,
          ),
        ].reduce(json1.type.compose, null);
        break;
      case 'style':
        if (type === 'edge') throw Error('看不懂');

        let styleNode =
          this.flow.data[type === 'node' ? 'nodes' : 'edges'][param[0].id];
        styleNode.style = param[0].style;

        op = [
          json1.replaceOp(
            [type === 'node' ? 'nodes' : 'edges', param[0].id.toString()],
            true,
            styleNode,
          ),
        ].reduce(json1.type.compose, null);
        break;
      case 'select':
        currentNode =
          this.flow.data[type === 'node' ? 'nodes' : 'edges'][param[0].id];

        op = [
          json1.replaceOp(
            [type === 'node' ? 'nodes' : 'edges', param[0].id.toString()],
            true,
            currentNode,
          ),
        ].reduce(json1.type.compose, null);
        break;
      default:
        break;
    }
    this.flow.submitOp(op, (error) => {
      if (error) {
        this.flow.submitOp(op);
      }
    });
  }

  convertFlowData(flow) {
    const toReturn = JSON.parse(JSON.stringify(flow));
    toReturn.edges = Object.values(toReturn.edges);
    toReturn.nodes = Object.values(toReturn.nodes);
    return toReturn;
  }
}

// yohowang@gmail.com
function convert(email) {
  return email.replace(/[@.]/g, (match) => {
    if (match === '@') {
      return '-';
    } else if (match === '.') {
      return '_';
    }
  });
}

function deconvert(email) {
  return email.replace(/[-_]/g, (match) => {
    if (match === '-') {
      return '@';
    } else if (match === '_') {
      return '.';
    }
  });
}

export default FlowWebSocket;
export { convert, deconvert };
