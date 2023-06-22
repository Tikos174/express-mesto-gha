const router = require('express').Router();

const {
  getUsers,
  getUsersId,
  patchUserMe,
  patchAvatarMe,
  getUserMe,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getUserMe);
router.get('/:userId', getUsersId);
router.patch('/me', patchUserMe);
router.patch('/me/avatar', patchAvatarMe);

module.exports = router;
