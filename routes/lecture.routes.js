module.exports = app => {
  const lecture = require("../controllers/lecture.controller.js");

  var router = require("express").Router();

  router.post('/list', lecture.list);
  router.post('/add', lecture.add)

  app.use('/api/lecture', router);
};