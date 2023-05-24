/* eslint-disable no-param-reassign */
import { getSession } from '../model/redis/redisSession.js';
import { Flow, Node } from '../model/mongodb/model/index.js';

class WsRouter {
  constructor() {
    this.paths = [];
  }

  session(path, callback) {
    const exec = async (ws, req) => {
      const sess = await getSession(req.headers.cookie);
      // console.log('1', req.url);
      if (!sess) {
        ws.close(1001);
        return;
      }

      const { email } = sess;
      // ws.email = email;
      const url = req.url.split('?');
      const params = new URLSearchParams(url[1]);
      const route = url[0].split('/');

      let Mode;

      ws.email = email;
      ws.params = params;

      switch (route[2]) {
        case 'node':
          Mode = Node;
          break;
        case 'flow':
          Mode = Flow;
          break;
        default:
          break;
      }

      if (!Mode) return;
      const can = await Mode.CanUserEdit(
        params.get('id'),
        params.get('id').split('-')[0],
        email,
      );
      if (!can) {
        ws.close(1000);
        return;
      }

      callback(ws);
    };

    this.paths.push({
      path,
      exec,
    });
    return this;
  }

  no_session(path, callback) {
    const exec = (ws) => {
      callback(ws);
    };

    this.paths.push({
      path,
      exec,
    });
    return this;
  }

  serve(ws, req) {
    const urlList = req.url
      .split('?')[0]
      .split('/')
      .filter((data, index) => index !== 0 && index !== 1);
    const url = `/${urlList.join('/')}`;
    for (let i = 0; i < this.paths.length; i += 1) {
      if (url === this.paths[i].path) {
        this.paths[i].exec(ws, req);
      }
    }
  }
}

export default WsRouter;
