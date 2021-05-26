const routeCards = require('express').Router();
const { getCards, createCard, deleteCard, likeCard, dislikeCard } = require('../controllers/cards');

routeCards.get('/cards', getCards);
routeCards.post('/cards', createCard);
routeCards.delete('/cards/:cardId', deleteCard);
routeCards.put('/cards/:cardId/likes', likeCard);
routeCards.delete('/cards/:cardId/likes', dislikeCard);

module.exports = routeCards;