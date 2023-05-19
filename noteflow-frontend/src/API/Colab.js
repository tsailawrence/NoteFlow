import ReconnectingWebSocket from 'reconnecting-websocket';
import { BASE_URL } from './api';
import tinycolor from 'tinycolor2';
import crc32 from 'crc-32';

class Colab {
  constructor(nodeId, email, callback) {
    const socket = new ReconnectingWebSocket(
      `wss://${BASE_URL}/ws/registerNodeColab?id=${nodeId}`,
    );

    socket.addEventListener('message', (msg) => {
      const message = JSON.parse(msg.data.toString('utf-8'));
      let userList = new Array(message.length);
      message.forEach((m, id) => {
        const newList = m.split('-');
        const singleUser = newList[newList.length - 1];
        userList[id] = singleUser;
      });
      callback(userList);
    });

    socket.addEventListener('open', () => {
      socket.send(
        JSON.stringify({
          nodeId: nodeId,
          email: email,
        }),
      );
      this.timerId = setInterval(() => {
        socket.send(
          JSON.stringify({
            nodeId: nodeId,
            email: email,
          }),
        );
      }, 2000);
    });

    socket.addEventListener('error', function (event) {
      console.error('WebSocket error:', event);
    });

    this.socket = socket;
  }

  close() {
    clearInterval(this.timerId);
    this.socket.close();
  }
}

function allocateColor(id, hourly = false) {
  let crcId = Math.abs(crc32.str(id));

  if (hourly) {
    crcId += Date.now() / 3600000;
  }

  const r = crcId % 256;
  const g = (crcId >> 8) % 256;
  const b = (crcId >> 16) % 256;
  return tinycolor({ r, g, b });
}

export { Colab, allocateColor };
