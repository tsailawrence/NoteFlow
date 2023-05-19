import { Flows } from '../../model/mongodb/model/index.js';

const setFlowTitle = async (ctx) => {
  const { id, title } = ctx.request.body;

  try {
    const result = await Flows.setTitle(id, title);

    ctx.status = 200;
    ctx.body = JSON.stringify(result);
  } catch (e) {
    ctx.throw(500, 'Internal server error');
  }
};

export default setFlowTitle;
