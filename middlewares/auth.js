const jwt = require('jsonwebtoken');
const NotАuthorized = require('../utils/notAuthorized');

const auth = (req, res, next) => {
  const { token } = req.cookies;
  let payload;

  try {
    payload = jwt.verify(token, 'SECRET');
  } catch (err) {
    next(new NotАuthorized('Необходима авторизация'));
  }

  req.user = payload;
  return next();
};

module.exports = auth;
