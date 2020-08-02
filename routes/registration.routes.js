module.exports = app => {
    const registration = require("../controllers/registration.controller.js");
  
    var router = require("express").Router();

    router.post('/find', registration.find)
    router.post('/list', registration.list)
    router.post('/add', registration.add)
    router.post('/register', registration.register)
    router.post('/close', registration.close)
    router.post('/download', registration.download)
  
    app.use('/api/registration', router);
  };