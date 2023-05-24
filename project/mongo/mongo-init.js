db.createUser({
  user: process.env["MONGO_NOTEFLOW_USERNAME"],
  pwd: process.env["MONGO_NOTEFLOW_PASSWORD"],
  roles: [
    {
      role: "readWrite",
      db: "noteflow",
    },
  ],
});
