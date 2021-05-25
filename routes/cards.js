const routeCards = require('express').Router();
const { getCards, createCard, deleteCard } = require('../controllers/cards');

routeCards.get('/cards', getCards);
routeCards.post('/cards', createCard);
routeCards.delete('/cards/:cardId', deleteCard);

module.exports = routeCards;