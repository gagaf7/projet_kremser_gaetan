module.exports = app => {
  const pollutionController = require("../controllers/pollution.controllers.js");
  const { checkJwt } = require("./jwtMiddleware");

  var router = require("express").Router();

  router.post("/", checkJwt, pollutionController.create);
  router.get("/", pollutionController.findAll);
  router.get("/:id", pollutionController.findOne);
  router.put("/:id", checkJwt, pollutionController.update);
  router.delete("/:id", checkJwt, pollutionController.delete);
  router.delete("/", checkJwt, pollutionController.deleteAll);

  app.use('/api/pollutions', router);
};