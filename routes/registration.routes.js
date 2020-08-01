module.exports = app => {
    const registration = require("../controllers/registration.controller.js");
  
    var router = require("express").Router();

    router.post('/list', registration.list)
    router.post('/add', registration.add)
  
    app.use('/api/registration', router);
  };