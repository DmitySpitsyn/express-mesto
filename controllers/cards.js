const cards = require('../models/card');

module.exports.getCards = (req, res) => {
    cards.find({})
        .then(cards => res.send({ data: cards }))
        .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.createCard = (req, res) => {
    const { name, link } = req.body;
    const owner = req.user._id;
    console.log({ name, link, owner })
    cards.create({ name, link, owner })
        .then(card => res.send({ data: card }))
        .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.deleteCard = (req, res) => {
    const { cardId } = req.params;
    console.log(cardId)
    cards.findByIdAndDelete(cardId)
        .then(card => res.send({ data: card }))
        .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};