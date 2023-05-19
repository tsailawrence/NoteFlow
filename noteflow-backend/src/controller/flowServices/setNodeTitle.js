import { NodeRepo } from '../../model/mongodb/model/index.js';

const setNodeTitle = async (ctx) => {
  const { id, title } = ctx.request.body;

  try {
    const result = await NodeRepo.setTitle(id, title);

    ctx.status = 200;
    ctx.body = JSON.stringify(result);
  } catch (e) {
    ctx.throw(500, 'Internal server error');
  }
};

export default setNodeTitle;
