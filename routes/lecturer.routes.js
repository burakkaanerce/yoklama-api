module.exports = app => {
  const lecturer = require("../controllers/lecturer.controller.js");

  var router = require("express").Router();

  router.post("/login", lecturer.login);
  router.post("/signup", lecturer.signup);
  router.post("/whoami", lecturer.whoami);

  app.use('/api/lecturer', router);
};