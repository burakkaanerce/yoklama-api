module.exports = app => {
  const lecturer = require("../controllers/lecturer.controller.js");

  var router = require("express").Router();

  router.get('/', function(req, res, next) {
    res.send('respond with a resource');
  });
  router.post("/login", lecturer.login);
  /* // Create a new Tutorial
  router.post("/", lecturer.create);

  // Retrieve all lecturer
  router.get("/", lecturer.findAll);

  // Retrieve all published lecturer
  router.get("/published", lecturer.findAllPublished);

  // Retrieve a single Tutorial with id
  router.get("/:id", lecturer.findOne);

  // Update a Tutorial with id
  router.put("/:id", lecturer.update);

  // Delete a Tutorial with id
  router.delete("/:id", lecturer.delete);

  // Create a new Tutorial
  router.delete("/", lecturer.deleteAll); */

  app.use('/api/lecturer', router);
};