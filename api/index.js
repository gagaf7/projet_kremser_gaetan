const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();

// middleware
app.use(cors({
  origin: [
    'http://localhost:4200', // URL du frontend Angular en développement
    'https://projet-kremser-gaetan.onrender.com' // URL du frontend Angular en production
  ],
  credentials: true // Permet l'envoi de cookies
}));
app.use(cookieParser());
app.use(express.json({ limit: '10mb' })); // Increased for Base64 images
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// database
const db = require("./models");

db.sequelize.sync()
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Captain Miasm API" });
});

// routes
require("./routes/index.js")(app);

// set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

