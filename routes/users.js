const router = require('express').Router();
const { Joi, celebrate } = require('celebrate');

const {
  getUsers,
  getUsersId,
  patchUserMe,
  patchAvatarMe,
  getUserMe,
} = require('../controllers/users');

const regURL = /(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-/]))?/;

router.get('/', getUsers);

router.get('/me', getUserMe);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex().required(),
  }),
}), getUsersId);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
}), patchUserMe);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(regURL),
  }),
}), patchAvatarMe);

module.exports = router;
