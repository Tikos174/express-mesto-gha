const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwtToken = require('jsonwebtoken');
const User = require('../models/user');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

const getUserMe = (req, res, next) => {
  User.findId(req.user._id)
    .then((user) => res.send({ data: user }))
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(String(password), 10)
    .then((hashePassword) => User.create({
      name, about, avatar, email, password: hashePassword,
    }))
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.code === 11000) {
        next(new Error('Такой email уже зарегистрирован'));
      } else if (err.code === 'ValidationError') {
        next(new Error('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findLogin(email, password)
    .then((user) => {
      const token = jwtToken.sign({
        _id: user._id,
      }, 'SECRET', { expiresIn: '7d' });
      res
        .cookie('token', token, {
          maxAge: 3600000,
          httpOnly: true,
        })
        .send({ email });
    })
    .catch(next);
};

const logout = (req, res, next) => {
  User.findOne({ _id: req.user._id })
    .then(() => {
      res.clearCookie('token', { httpOnly: true }).send({ data: 'Выход успешно осуществлён.' });
    })
    .catch(next);
};

const getUsersId = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res
          .status(404)
          .send({ message: 'Пользователь по указанному _id не найден.' });
        return;
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res
          .status(400)
          .send({ message: 'Пользователь по указанному _id не найден.' });
        return;
      }
      res.status(500).send({ message: 'Ошибка по умолчанию' });
    });
};

const patchUserMe = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        res
          .status(404)
          .send({ message: 'Пользователь с указанным _id не найден.' });
        return;
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(400).send({
          message: 'Переданы некорректные данные при обновлении профиля.',
        });
        return;
      }
      res.status(500).send({ message: 'Ошибка по умолчанию' });
    });
};

const patchAvatarMe = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        res
          .status(404)
          .send({ message: 'Пользователь с указанным _id не найден.' });
        return;
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(400).send({
          message: 'ППереданы некорректные данные при обновлении аватара.',
        });
        return;
      }
      res.status(500).send({ message: 'Ошибка по умолчанию' });
    });
};

module.exports = {
  logout,
  login,
  getUsers,
  getUsersId,
  createUser,
  patchUserMe,
  getUserMe,
  patchAvatarMe,
};
