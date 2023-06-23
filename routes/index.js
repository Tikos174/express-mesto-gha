// const router = require('express').Router();
// const { Joi, celebrate } = require('celebrate');
// const userRouter = require('./users');
// const cardsRoutes = require('./cards');
// const auth = require('../middlewares/auth');
// const {
//   login,
//   createUser,
// } = require('../controllers/users');

// const regURL = /(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-/]))?/;

// router.post('/signup', celebrate({
//   body: Joi.object().keys({
//     name: Joi.string().min(2).max(30),
//     avatar: Joi.string().pattern(regURL),
//     about: Joi.string().min(2).max(30),
//     email: Joi.string().email().required(),
//     password: Joi.string().required(),
//   }),
// }), createUser);

// router.post('/signin', celebrate({
//   body: Joi.object().keys({
//     email: Joi.string().email().required(),
//     password: Joi.string().required(),
//   }),
// }), login);

// router.use(auth);
// router.use('/users', userRouter);
// router.use('/cards', cardsRoutes);

// module.exports = router;
