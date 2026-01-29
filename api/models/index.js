const config = require("../config.js");
const Sequelize = require("sequelize");

console.log("Connecting to database:", config.DB);

const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    port: config.BDD.port,
    dialect: config.dialect,
    operatorsAliases: false,
    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    },
    // AJOUTEZ CE BLOC POUR ACTIVER LE SSL REQUIS PAR RENDER
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false // Nécessaire pour accepter les certificats auto-signés de Render
      }
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.pollution = require("./pollution.model.js")(sequelize, Sequelize);
db.utilisateur = require("./utilisateur.model.js")(sequelize, Sequelize);

// AJOUTEZ CES LIGNES POUR LA RELATION FAVORIS
db.utilisateur.belongsToMany(db.pollution, {
  through: "user_favorites",
  as: "favorites",
  foreignKey: "userId",
});
db.pollution.belongsToMany(db.utilisateur, {
  through: "user_favorites",
  as: "favoritedBy",
  foreignKey: "pollutionId",
});

module.exports = db;
