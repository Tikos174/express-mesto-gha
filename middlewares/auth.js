const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const { token } = req.cookies;
  let payload;

  try {
    payload = jwt.verify(token, 'SECRET');
  } catch (err) {
    next(err);
  }
  req.user = payload;
  next();
};

module.export = { auth };
