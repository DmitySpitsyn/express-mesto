const users = require('../models/user');

module.exports.getUsers = (req, res) => {
    users.find({})
        .then(users => res.send({ data: users }))
        .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.getUser = (req, res) => {
    const { id } = req.params;
    users.findById(id)
        .then(user => res.send({ data: user }))
        .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.createUser = (req, res) => {
    const { name, about, avatar } = req.body;
    users.create({ name, about, avatar })
        .then(user => res.send({ data: user }))
        .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.patchUser = (req, res) => {
    const { name, about } = req.body;
    const owner = req.user._id;
    console.log({ name, about, owner })
    users.findByIdAndUpdate(owner, { name, about })
        .then(user => res.send({ data: user }))
        .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.patchAvatar = (req, res) => {
    const { avatar } = req.body;
    const owner = req.user._id;
    users.findByIdAndUpdate(owner, { avatar })
        .then(user => res.send({ data: user }))
        .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};