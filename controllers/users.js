const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({ })
    .then((users) => res.send(users))
    .catch((err) => res.status(500).send({ message: 'ошибка сервера', err: err.message }));
};

const getUsersId = (req, res) => {
  User.findById(req.params.id)
    .then((user) => res.status(200).send(user))
    .catch((err) => res.status(500).send({ message: 'ошибка сервера', err: err.message }));
};

const postUser = (req, res) => {
  User.create(req.body)
    .then((user) => res.status(201).send(user))
    .catch((err) => res.status(500).send({ message: 'ошибка сервера', err: err.message }));
};

module.exports = {
  getUsers,
  getUsersId,
  postUser,
};
