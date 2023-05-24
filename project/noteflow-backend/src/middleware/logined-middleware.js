const logined = (ctx, next) => {
  if (!ctx.session.email) {
    ctx.throw(401, "Unauthorized. You haven't log in yet.");
  }
  return next();
};

export default logined;
