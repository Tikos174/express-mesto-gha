const mongoose = require('mongoose');
const Card = require('../models/cards');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(400).send({ message: 'Переданы некорректные данные при создании карточки' });
      } else {
        res.status(500).send({ message: 'Ошибка по умолчанию' });
      }
    });
};

const postCards = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((cards) => res.status(201).send({ data: cards }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(400).send({ message: 'Переданы некорректные данные при создании карточки.' });
        return;
      } res.status(500).send({ message: 'Ошибка по умолчанию' });
    });
};

const deleteCards = (req, res) => {
  const _id = req.params.cardId;

  Card.findByIdAndRemove({ _id })
    .then((cards) => {
      if (!cards) {
        res.status(404).send({ message: 'Карточка с указанным _id не найдена.' });
        return;
      } res.status(200).send(cards);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status(400).send({ message: 'Переданы некорректные данные.' });
        return;
      } res.status(500).send({ message: 'Ошибка по умолчанию' });
    });
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
