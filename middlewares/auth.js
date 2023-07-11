const jwt = require('jsonwebtoken');
const NotАuthorized = require('../utils/notAuthorized');

const { NODE_ENV, JWT_SECRET } = process.env;

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    next(new NotАuthorized('Необходима авторизация'));
  }

  req.user = payload;

  return next();
};

module.exports = auth;
