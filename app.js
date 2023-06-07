const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes/index');

const app = express();

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(express.json());

app.use(router);

app.listen(3001, () => {
  // eslint-disable-next-line no-console
  console.log('Работают');
});
