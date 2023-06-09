const router = require('express').Router();

const {
  getUsers,
  getUsersId,
  postUser,
  patchUserMe,
  patchAvatarMe,
} = require('../controllers/users');

router.get('/', getUsers);

router.post('/', postUser);

router.get('/:userId', getUsersId);

router.patch('/me', patchUserMe);

router.patch('/me/avatar', patchAvatarMe);

module.exports = router;
