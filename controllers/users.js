const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFound = require('../utils/not-found-err');
const IncorrectRequest = require('../utils/incorrectRequest');
const ConflictEmail = require('../utils/conflictEmail');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(201).send(users))
    .catch(next);
};

const getUserMe = (req, res, next) => {
  const { _id } = req.user;
  User.findOne({ _id })
    .then((user) => res.status(200).send(user))
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => {
      const newUser = user.toObject();
      delete newUser.password;
      res.status(201).send(newUser);
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictEmail(`Пользователь с такой электронной почтой ${email} уже зарегистрирован`));
      }
      if (err.name === 'ValidationError') {
        next(new IncorrectRequest('Неверный запрос'));
      }
      next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({
        _id: user._id,
      }, 'SECRET', { expiresIn: '7d' });
      res.cookie('token', token, {
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

const getUsersId = (req, res, next) => {
  const { userId } = req.params;
  return User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFound('Нет пользователя с таким id');
      }
      return res.status(201).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new IncorrectRequest('Введен неверный id'));
        return;
      }
      next(err);
    });
};

const patchUserMe = (req, res, next) => {
  const userId = req.user._id;
  const { name, about } = req.body;
  return User.findByIdAndUpdate(
    userId,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        throw new NotFound('Нет пользователя с таким id');
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new IncorrectRequest('Произошла ошибка валидации');
      }
      next(err);
    });
};

const patchAvatarMe = (req, res, next) => {
  const userId = req.user._id;
  const { avatar } = req.body;
  return User.findByIdAndUpdate(
    userId,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        throw new NotFound('Нет пользователя с таким id');
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new IncorrectRequest('Неверный запрос');
      }
      next(err);
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
