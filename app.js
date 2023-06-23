const express = require('express');
const mongoose = require('mongoose');
const { Joi, celebrate } = require('celebrate');
const cookieParser = require('cookie-parser');
const userRouter = require('./routes/users');
const cardsRoutes = require('./routes/cards');
const {
  login,
  createUser,
} = require('./controllers/users');

// const router = require('./routes/index');

// const error = require('./middlewares/errorCentr');
const auth = require('./middlewares/auth');

const regURL = /(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-/]))?/;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(regURL),
    about: Joi.string().min(2).max(30),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), createUser);

app.use('/users', auth, userRouter);
app.use('/cards', auth, cardsRoutes);

// app.use(error);

app.listen(3000);
