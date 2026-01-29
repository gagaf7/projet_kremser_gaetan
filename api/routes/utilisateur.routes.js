module.exports = app => {
  const utilisateurController = require("../controllers/utilisateur.controllers.js");

  var router = require("express").Router();

  router.post("/", utilisateurController.create);
  router.get("/", utilisateurController.findAll);
  router.get("/:id", utilisateurController.findOne);
  router.put("/:id", utilisateurController.update);
  router.delete("/:id", utilisateurController.delete);
  router.post("/login", utilisateurController.login);
  router.post("/signup", utilisateurController.signup);
  router.post("/logout", utilisateurController.logout);
  
  // Routes Favoris
  router.post("/:id/favorites", utilisateurController.addFavorite);
  router.delete("/:id/favorites/:pollutionId", utilisateurController.removeFavorite);
  router.get("/:id/favorites", utilisateurController.getFavorites);

  app.use('/api/users', router);
};