const whoAmI = async (ctx) => {
  if (!ctx.session.email || !ctx.session.logined) {
    ctx.throw(401, 'You have no login data.');
  }

  ctx.body = JSON.stringify(ctx.session);
  ctx.status = 200;
};

export default whoAmI;
