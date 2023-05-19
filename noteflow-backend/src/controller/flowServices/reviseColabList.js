import { FlowList, Flow, NodeRepo } from '../../model/mongodb/model/index.js';
import db from '../../lib/db.js';

const reviseColabList = async (ctx) => {
  const { colabs, id } = ctx.request.body;
  if (!id || !colabs) {
    ctx.throw(402, 'You did not offer sufficient data');
  }

  const path = ctx.request.url.split('/')[2];
  let schema;
  if (path === 'flows') {
    schema = new FlowList(ctx.session.email);
  }
  const added = [];
  const removed = [];
  try {
    for (let index = 0; index < colabs.length; index++) {
      const data = colabs[index];
      if (data.type === 'new') {
        // 應該要先確認有沒有這一個人
        const result = await db('users').first().where({ email: data.email });
        if (result) {
          // 真的有這個人
          colabs[index].status = 200;
          added.push(data.email);
          if (schema) {
            await schema.addSomebodyToFlowList(data.email, id);
          }
        } else {
          // 沒有這個人
          colabs[index].status = 404;
        }
      } else if (data.type === 'remove') {
        if (data.email === id.split('-')[0]) {
          // 如果是本人的 Flow
          colabs[index].status = 400;
        } else {
          const result = await db('users').first().where({ email: data.email });
          if (result) {
            // 真的有這個人
            colabs[index].status = 200;
            removed.push(data.email);
            if (schema) {
              await schema.removeSomebodyFromFlowList(data.email, id);
            }
          } else {
            // 沒有這個人
            colabs[index].status = 404;
          }
        }
      }
    }

    if (schema) {
      await Flow.refreshColabs(id, added, removed);
    } else {
      await NodeRepo.refreshColabs(id, added, removed);
    }
    // eslint-disable-next-line no-empty
  } catch (err) {
    ctx.throw(500, JSON.stringify(err));
  }

  ctx.status = 200;
  ctx.body = JSON.stringify(colabs);
};

//

export default reviseColabList;
