/* eslint-disable no-shadow */
const validator = require('validator');
const cards = require('../models/card');
const IncorrectDataError = require('../errors/incorrect-data-error');
const NotFoundError = require('../errors/not-found-error');

module.exports.getCards = (req, res, next) => {
  cards.find({})
    .then((items) => res.send(items))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  if (!validator.isURL(link)) {
    throw new IncorrectDataError('Ссылка некорректна!');
  }
  cards.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch(() => {
      throw new IncorrectDataError('Переданы некорректные данные при создании карточки.');
    }).catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  return cards.findById(cardId).then((card) => {
    if (card) {
      if (card.owner.toString() === req.user._id) {
        res.status(200).send(card);
        card.remove();
        return;
      }
      const error = new Error('Нельзя удалить чужую карточку');
      error.statusCode = 403;
      next(error);
    }
    throw new NotFoundError('Карточка по указанному _id не найдена.');
  }).catch(next);
};

module.exports.likeCard = (req, res, next) => {
  const { cardId } = req.params;
  cards.findById(cardId).then((card) => {
    if (!card) { throw new NotFoundError('Карточка по указанному _id не найдена.'); }
    cards.findOneAndUpdate({ _id: cardId }, { $addToSet: { likes: req.user._id } },
      { runValidators: true, new: true }, (err, card) => res.send(card));
  }).catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  const { cardId } = req.params;
  cards.findById(cardId).then((card) => {
    if (!card) { throw new NotFoundError('Карточка по указанному _id не найдена.'); }
    cards.findOneAndUpdate({ _id: cardId }, { $pull: { likes: req.user._id } },
      { runValidators: true, new: true }, (err, card) => res.send(card));
  }).catch(next);
};
