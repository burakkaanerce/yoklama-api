module.exports = app => {
    const lecturer = require("../controllers/lecturer.controller.js");
  
    var router = require("express").Router();
  
    app.use('/api/student', router);
  };