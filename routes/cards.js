const routeCards = require('express').Router();
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');
const auth = require('../middlewares/auth');
routeCards.get('/', getCards);
routeCards.post('/', createCard);
routeCards.delete('/:cardId', deleteCard);
routeCards.put('/:cardId/likes', likeCard);
routeCards.delete('/:cardId/likes', dislikeCard);

module.exports = routeCards;
