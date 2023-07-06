const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const cors = require('cors');
const path = require('path');
const userRouter = require('./routes/users');
const cardsRoutes = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const NotFound = require('./utils/notFoundErr');
const errorHandler = require('./middlewares/errorHandler');

const avatar = /^https?:\/\/[www.]?[\w\-._~:/?#[\]@!$&'()*+,;=%]+\.[\w\-._~:/?#[\]@!$&'()*+,;=%]+#?$/;
const password = /^[a-zA-z0-9]{8,}$/;

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  credentials: true,
  methods: ['GET', 'PUT', 'POST', 'DELETE', 'PATCH'],
  origin: ['http://api.mesto.yandex.students.nomoreparties.sbs', 'http://mesto.yandex.students.nomoreparties.sbs', 'http://localhost:3000', 'http://localhost:3001'],
}));

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().pattern(password),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().pattern(password),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(avatar),
  }),
}), createUser);

app.use('/users', auth, userRouter);
app.use('/cards', auth, cardsRoutes);

app.use('/api', require('./routes/cards'));
app.use('/api', require('./routes/users'));

app.use(auth, (req, res, next) => {
  next(new NotFound('Запрашиваемый ресурс не найден'));
});

app.use(express.static(path.join(__dirname, 'public')));

app.use(errors());

app.use(errorHandler);

app.listen(3000);
