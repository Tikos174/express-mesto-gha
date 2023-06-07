const router = require('express').Router();
const {
  getUsers, getUsersId, postUser,
} = require('../controllers/users');

router.get('/', getUsers);

router.get('/:id', getUsersId);

router.post('/', postUser);

module.exports = router;
