import CODE from '../../lib/httpStatus.js';

const getColabList = async (ctx) => {
  // 在 middleware 已經 get 好
  ctx.body = JSON.stringify(ctx.colabs);
  ctx.status = CODE.success;
};

export default getColabList;
