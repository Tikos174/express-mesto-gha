const mongoose = require('mongoose');
const Card = require('../models/cards');
const IncorrectRequest = require('../utils/incorrectRequest');
const NotFound = require('../utils/not-found-err');
const ForbiddenError = require('../utils/forbidden-err');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(next);
};

const postCards = (req, res, next) => {
  const { name, link } = req.body;
  const ownerId = req.user._id;

  return Card.create({ name, link, owner: ownerId })
    .then((cards) => res.status(201).send(cards))
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new IncorrectRequest('Неверный запрос'));
      }
      next(err);
    });
};

const deleteCards = (req, res, next) => {
  const _id = req.params.cardId;

  Card.findByIdAndRemove({ _id })
    .then((card) => {
      if (!card) {
        throw new NotFound('Карточка не найдена');
      }
      if (card.owner.toString() !== _id.toString()) {
        throw new ForbiddenError('У вас нет прав на удаление этой карточки');
      }
      return Card.findByIdAndRemove(req.params.cardId)
        .then(() => res.status(200).send({ data: card }))
        .catch(next);
    })
    .catch(next);
};

const postLikeCards = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((cards) => {
      if (!cards) {
        res.status(404).send({ message: 'Передан несуществующий _id карточки.' });
        return;
      }
      res.status(200).send({ data: cards });
    })

    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status(400).send({ message: 'Переданы некорректные данные для постановки/снятии лайка.' });
        return;
      } res.status(500).send({ message: 'Ошибка по умолчанию' });
    });
};

const deleteLikeCards = (req, res) => {
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
      res.status(200).send({ data: cards });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status(400).send({ message: 'Переданы некорректные данные для постановки/снятии лайка.' });
        return;
      } res.status(500).send({ message: 'Ошибка по умолчанию' });
    });
};

module.exports = {
  getCards,
  postCards,
  deleteCards,
  postLikeCards,
  deleteLikeCards,
};
