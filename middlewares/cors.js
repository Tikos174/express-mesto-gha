/* eslint-disable linebreak-style */
const allowedCors = [
  'https://mesto.yandex.students.nomoreparties.sbs',
  'https://api.mesto.yandex.students.nomoreparties.sbs',
];

const requestOptions = {
  origin: allowedCors,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
  allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
};

module.exports = requestOptions;
