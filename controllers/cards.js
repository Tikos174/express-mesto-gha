const Card = require('../models/cards');
const NotFound = require('../utils/notFoundErr'); // 404
const ForbiddenError = require('../utils/forbiddenErr'); // 403
const IncorrectRequest = require('../utils/incorrectRequest'); // 400

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(next);
};

const postCards = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((cards) => res.status(201).send({ data: cards }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new IncorrectRequest({ message: 'Переданы некорректные данные при создании карточки' }));
        return;
      } next(err);
    });
};

const deleteCards = (req, res, next) => {
  const userId = req.user._id;

  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        next(new NotFound('Карточка с указанным _id не найдена.'));
        return;
      }
      if (card.owner.toString() !== userId.toString()) {
        next(new ForbiddenError('У вас нет прав на удаление этой карточки'));
        return;
      }
      Card.findByIdAndRemove(req.params.cardId)
        .then(() => res.status(200).send({ data: card }))
        .catch(next);
    })
    .catch(next);
};

const postLikeCards = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((cards) => {
      if (!cards) {
        next(new NotFound('Передан несуществующий _id карточки.'));
        return;
      }
      res.status(200).send(cards);
    })

    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new IncorrectRequest('Переданы некорректные данные для постановки/снятии лайка.'));
        return;
      } next(err);
    });
};

const deleteLikeCards = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((cards) => {
      if (!cards) {
        res.status(404).send({ message: 'Передан несуществующий _id карточки.' });
        return;
      }
      res.status(200).send(cards);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new IncorrectRequest('Переданы некорректные данные для постановки/снятии лайка.'));
        return;
      } next(err);
    });
};

module.exports = {
  getCards,
  postCards,
  deleteCards,
  postLikeCards,
  deleteLikeCards,
};
