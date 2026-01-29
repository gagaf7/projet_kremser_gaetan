const db = require("../models");
const Utilisateur = db.utilisateur;
const Pollution = db.pollution; // Assurez-vous d'importer Pollution

const jwt = require('jsonwebtoken');
const { ACCESS_TOKEN_SECRET } = require("../config.js");

function generateAccessToken(user) {
  return jwt.sign(user, ACCESS_TOKEN_SECRET, { expiresIn: '1800s' });
}

// Create a new Utilisateur
exports.create = (req, res) => {
  if (!req.body.username || !req.body.email) {
    res.status(400).send({
      message: "Username and email are required!"
    });
    return;
  }

  Utilisateur.create(utilisateur)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the utilisateur."
      });
    });
};

// Retrieve all Utilisateurs
exports.findAll = (req, res) => {
  Utilisateur.findAll()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving utilisateurs."
      });
    });
};

// Find a single Utilisateur with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Utilisateur.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Utilisateur with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Utilisateur with id=" + id
      });
    });
};

// Update a Utilisateur by the id
exports.update = (req, res) => {
  const id = req.params.id;

  Utilisateur.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Utilisateur was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Utilisateur with id=${id}. Maybe Utilisateur was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Utilisateur with id=" + id
      });
    });
};

// Delete a Utilisateur with the specified id
exports.delete = (req, res) => {
  const id = req.params.id;

  Utilisateur.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Utilisateur was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Utilisateur with id=${id}. Maybe Utilisateur was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Utilisateur with id=" + id
      });
    });
};

// Login
exports.login = (req, res) => {
  if (!req.body.email || !req.body.password) {
    res.status(400).send({
      message: "Email and password are required!"
    });
    return;
  }

  Utilisateur.findOne({
    where: {
      email: req.body.email
    }
  })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: "Utilisateur not found!"
        });
      } else if (data.password !== req.body.password) {
        res.status(401).send({
          message: "Invalid password!"
        });
      } else {
        const user = {
          id: data.id,
          username: data.username,
          email: data.email
        };
        
        let accessToken = generateAccessToken(user);
        
        // Envoyer le token dans un cookie HttpOnly (sécurisé)
        res.cookie('authToken', accessToken, {
          httpOnly: true,  // Inaccessible via JavaScript
          secure: true, // HTTPS requis (API sur Render)
          sameSite: 'none', // Requis pour cross-origin (localhost -> Render)
          path: '/',
          maxAge: 30 * 60 * 1000 // 30 minutes
        });
        
        res.send({
          message: "Login successful!",
          utilisateur: user
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while logging in."
      });
    });
};

// Signup
exports.signup = (req, res) => {
  console.log('Signup request received:', req.body);
  
  if (!req.body.username || !req.body.email || !req.body.password) {
    console.log('Missing fields in signup request');
    res.status(400).send({
      message: "Username, email and password are required!"
    });
    return;
  }

  const utilisateur = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  };

  console.log('Attempting to create user:', { username: utilisateur.username, email: utilisateur.email });

  Utilisateur.create(utilisateur)
    .then(data => {
      const user = {
        id: data.id,
        username: data.username,
        email: data.email
      };
      
      // Générer un token pour l'utilisateur nouvellement créé
      let accessToken = generateAccessToken(user);
      
      // Envoyer le token dans un cookie HttpOnly (sécurisé)
      res.cookie('authToken', accessToken, {
        httpOnly: true,  // Inaccessible via JavaScript
        secure: true, // HTTPS requis (API sur Render)
        sameSite: 'none', // Requis pour cross-origin (localhost -> Render)
        path: '/',
        maxAge: 30 * 60 * 1000 // 30 minutes
      });
      
      res.send({
        message: "Utilisateur created successfully!",
        utilisateur: user
      });
    })
    .catch(err => {
      console.error('Signup error:', err);
      
      // Gérer les erreurs de contrainte unique (email ou username déjà existant)
      if (err.name === 'SequelizeUniqueConstraintError') {
        const field = err.errors[0].path;
        res.status(409).send({
          message: `This ${field} is already in use.`
        });
      } else {
        res.status(500).send({
          message: err.message || "Some error occurred while creating the utilisateur."
        });
      }
    });
};

// Add a favorite
exports.addFavorite = (req, res) => {
  const userId = req.params.id;
  const pollutionId = req.body.pollutionId;

  Utilisateur.findByPk(userId)
    .then(user => {
      if (!user) {
        res.status(404).send({ message: "User not found" });
        return;
      }
      return Pollution.findByPk(pollutionId).then(pollution => {
        if (!pollution) {
          res.status(404).send({ message: "Pollution not found" });
          return;
        }
        user.addFavorites(pollution);
        res.send({ message: "Added to favorites" });
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

// Remove a favorite
exports.removeFavorite = (req, res) => {
  const userId = req.params.id;
  const pollutionId = req.params.pollutionId;

  Utilisateur.findByPk(userId)
    .then(user => {
      if (!user) {
        res.status(404).send({ message: "User not found" });
        return;
      }
      return Pollution.findByPk(pollutionId).then(pollution => {
        if (!pollution) {
          res.status(404).send({ message: "Pollution not found" });
          return;
        }
        user.removeFavorites(pollution);
        res.send({ message: "Removed from favorites" });
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

// Get user favorites
exports.getFavorites = (req, res) => {
  const userId = req.params.id;

  Utilisateur.findByPk(userId, {
    include: [
      {
        model: Pollution,
        as: "favorites",
        attributes: ["id", "titre", "type_pollution", "description", "date_observation", "lieu", "latitude", "longitude", "photo_url"],
        through: {
          attributes: [],
        }
      },
    ],
  })
    .then(user => {
      if (!user) {
        res.status(404).send({ message: "User not found" });
        return;
      }
      res.send(user.favorites);
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

// Logout - Clear the auth cookie
exports.logout = (req, res) => {
  res.clearCookie('authToken', {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/'
  });
  res.send({ message: "Logged out successfully" });
};