const db = require("../models");
const Pollution = db.pollution;

// Create a new Pollution
exports.create = (req, res) => {
  if (!req.body.titre) {
    res.status(400).send({
      message: "Titre is required!"
    });
    return;
  }

  const pollution = {
    titre: req.body.titre,
    type_pollution: req.body.type,
    description: req.body.description,
    date_observation: req.body.dateObservation,
    lieu: req.body.lieu,
    latitude: req.body.latitude,
    longitude: req.body.longitude,
    photo_url: req.body.photoUrl
  };

  Pollution.create(pollution)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Pollution."
      });
    });
};

// Retrieve all Pollutions
exports.findAll = (req, res) => {
  Pollution.findAll()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving pollutions."
      });
    });
};

// Find a single Pollution with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Pollution.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Pollution with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Pollution with id=" + id
      });
    });
};

// Update a Pollution by the id
exports.update = (req, res) => {
  const id = req.params.id;

  const pollution = {
    titre: req.body.titre,
    type_pollution: req.body.type,
    description: req.body.description,
    date_observation: req.body.dateObservation,
    lieu: req.body.lieu,
    latitude: req.body.latitude,
    longitude: req.body.longitude,
    photo_url: req.body.photoUrl
  };

  Pollution.update(pollution, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Pollution was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Pollution with id=${id}. Maybe Pollution was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Pollution with id=" + id
      });
    });
};

// Delete a Pollution with the specified id
exports.delete = (req, res) => {
  const id = req.params.id;

  Pollution.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Pollution was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Pollution with id=${id}. Maybe Pollution was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Pollution with id=" + id
      });
    });
};

// Delete all Pollutions
exports.deleteAll = (req, res) => {
  Pollution.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Pollutions were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all pollutions."
      });
    });
};
