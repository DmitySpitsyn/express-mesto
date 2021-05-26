const users = require('../models/user');

module.exports.getUsers = (req, res) => {
    return users.find({})
        .then(users => { return res.status(200).send({ data: users }) })
        .catch(() => res.status(500).send({ message: 'Ошибка по-умолчанию' }));
};

module.exports.getUser = (req, res) => {
    const { id } = req.params;
    return users.findById(id)
        .then(user => {
            if (user) { return res.status(200).send({ data: user }) }
            return res.status(400).send({ message: 'Пользователь по указанному _id не найден.' })
        })
        .catch(() => res.status(500).send({ message: 'Ошибка по-умолчанию' }));
};

module.exports.createUser = (req, res) => {
    const { name, about, avatar } = req.body;
    users.create({ name, about, avatar })
        .then(user => res.send({ data: user }))
        .catch((err) => {
            if (err.name == 'ValidationError') {
                return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.' })
            }
            return res.status(500).send({ message: 'ошибка по-умолчанию' })
        });

};

module.exports.patchUser = (req, res) => {
    const { name, about } = req.body;
    const owner = req.user._id;
    console.log({ name, about, owner })
    users.findByIdAndUpdate(owner, { name, about })
        .then(user => {
            if (user) { return res.status(200).send({ data: user }) }
            return res.status(400).send({ message: 'Пользователь по указанному _id не найден.' })
        })
        .catch(() => res.status(500).send({ message: 'Ошибка по-умолчанию' }));
};

module.exports.patchAvatar = (req, res) => {
    const { avatar } = req.body;
    const owner = req.user._id;
    users.findByIdAndUpdate(owner, { avatar })
        .then(user => {
            if (user) { return res.status(200).send({ data: user }) }
            return res.status(400).send({ message: 'Пользователь по указанному _id не найден.' })
        })
        .catch(() => res.status(500).send({ message: 'Ошибка по-умолчанию' }));

};