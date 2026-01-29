module.exports =  {
    ACCESS_TOKEN_SECRET : "EMMA123",
    BDD : {
    "host" :"dpg-d5g0m5qli9vc73dsucvg-a.oregon-postgres.render.com",
    "port" : "5432",
    "user" : "pollutionbasev3_user",
    "password" : "UxDFEqKXE5CDfNoYMdqK6LTfpxepV1W6",
    "bdname" :"pollutionbasev3" 
    },
    // Propriétés pour Sequelize
    HOST: "dpg-d5g0m5qli9vc73dsucvg-a.oregon-postgres.render.com",
    USER: "pollutionbasev3_user",
    PASSWORD: "UxDFEqKXE5CDfNoYMdqK6LTfpxepV1W6",
    DB: "pollutionbasev3",
    dialect: "postgres",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
};