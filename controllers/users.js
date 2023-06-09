const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({ })
    .then((users) => res.send(users))
    .catch(() => res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' }));
};

const postUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

const getUsersId = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => new Error('Not found'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      } else if (err.message === 'Not Found') {
        res.status(404).send({ message: 'Пользователь по указанному id не найден' });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

const patchUserMe = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      } else if (err.message === 'Not Found') {
        res.status(404).send({ message: 'Пользователь по указанному id не найден' });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

const patchAvatarMe = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.message === 'Not found') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports = {
  getUsers,
  getUsersId,
  postUser,
  patchUserMe,
  patchAvatarMe,
};
