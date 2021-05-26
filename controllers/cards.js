const cards = require('../models/card');

function validatorError(res, err, text) {
    if (err.name == 'ValidationError') {
        return res.status(400).send({ message: text })
    }
    return res.status(500).send({ message: 'ошибка по-умолчанию' })
}

module.exports.getCards = (req, res) => {
    cards.find({})
        .then(cards => res.send({ data: cards }))
        .catch(() => res.status(500).send({ message: 'ошибка по-умолчанию' }));
};

module.exports.createCard = (req, res) => {
    const { name, link } = req.body;
    const owner = req.user._id;
    cards.create({ name, link, owner })
        .then(card => res.send({ data: card }))
        .catch((err) => {
            validatorError(res, err, 'Переданы некорректные данные при создании карточки.')
        });
};

module.exports.deleteCard = (req, res) => {
    const { cardId } = req.params;
    cards.findByIdAndDelete(cardId)
        .then(card => {
            if (card) { return res.status(200).send({ data: card }) }
            return res.status(400).send({ message: 'Карточка с указанным _id не найдена.' })
        })
        .catch(() => res.status(500).send({ message: 'Ошибка по-умолчанию' }));
};

module.exports.likeCard = (req, res) => {
    cards.updateOne({ _id: req.params.cardId }, { $addToSet: { likes: req.user._id } }, { runValidators: true })
        .then(card => res.send({ data: card }))
        .catch((err) => {
            validatorError(res, err, 'Переданы некорректные данные для постановки/снятии лайка.')
        });
};

module.exports.dislikeCard = (req, res) => {
    cards.updateOne({ _id: req.params.cardId }, { $pull: { likes: req.user._id } }, { runValidators: true })
        .then(card => res.send({ data: card }))
        .catch((err) => {
            validatorError(res, err, 'Переданы некорректные данные для постановки/снятии лайка.')
        });
};