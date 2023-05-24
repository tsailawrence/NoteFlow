const logout = async (ctx) => {
  ctx.session = null;
  ctx.status = 200;
};

export default logout;
