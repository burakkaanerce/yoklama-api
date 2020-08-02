module.exports = app => {
    const registration = require("../controllers/registration.controller.js");

    const authToken = require("../middleware/authToken");
  
    var router = require("express").Router();

    router.post('/find', authToken, registration.find)
    router.post('/findone', registration.findone)
    router.post('/list', authToken, registration.list)
    router.post('/add', authToken, registration.add)
    router.post('/register', registration.register)
    router.post('/close', authToken, registration.close)
    router.post('/download', authToken, registration.download)
    router.post('/delete', authToken, registration.delete)
  
    app.use('/api/registration', router);
  };