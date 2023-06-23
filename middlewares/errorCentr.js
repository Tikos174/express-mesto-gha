const error = (err, req, res) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? 'Неправильный адрес' : message,
  });
};

module.exports = error;
