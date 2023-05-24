const getColabList = async (ctx) => {
  const { id } = ctx.query;
  if (!id) {
    ctx.throw(402, 'You did not offer sufficient data');
  }
  // 在 middleware 已經 get 好
  ctx.body = JSON.stringify(ctx.colabs);
  ctx.status = 200;
};

export default getColabList;
