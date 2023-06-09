const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes/index');

const app = express();

// подключаемся к серверу mongo
mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '648085ad98e15f7048ce10d0',
  };

  next();
});

app.use(router);
app.use((req, res) => {
  res.status(404).send({ message: 'Неправильный адрес' });
});

app.listen(3000);
