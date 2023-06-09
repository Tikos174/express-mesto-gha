const router = require('express').Router();

const {
  getCards,
  postCards,
  deleteCards,
  postLikeCards,
  deleteLikeCards,
} = require('../controllers/cards');

router.get('/', getCards);

router.post('/', postCards);

router.delete('/:cardId', deleteCards);

router.put('/:cardId/likes', postLikeCards);

router.delete('/:cardId/likes', deleteLikeCards);

module.exports = router;
