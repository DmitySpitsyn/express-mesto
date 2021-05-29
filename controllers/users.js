const users = require('../models/user');

function validatorError(res, err, text) {
  if (err.name === 'ValidationError') {
    return res.status(400).send({ message: text });
  }
  return res.status(500).send({ message: 'ошибка по-умолчанию' });
}

module.exports.getUsers = (req, res) => {
  users.find({})
    .then((items) => {
      res.status(200).send({ data: items });
    })
    .catch(() => res.status(500).send({ message: 'Ошибка по-умолчанию' }));
};

module.exports.getUser = (req, res) => {
  const { id } = req.params;
  return users.findById(id)
    .then((user) => {
      res.status(200).send({
        name: user.name, about: user.about, avatar: user.avatar, _id: user._id,
      });
    })
    .catch((user) => {
      if (user) {
        return res.status(400).send({ message: 'Пользователь по указанному _id не найден.' });
      }
      return res.status(500).send({ message: 'Ошибка по-умолчанию' });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  users.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      validatorError(res, err, 'Переданы некорректные данные при создании пользователя.');
    });
};

module.exports.patchUser = (req, res) => {
  const { name, about } = req.body;
  const owner = req.user._id;
  console.log({ name, about, owner });
  users.findByIdAndUpdate(owner, { name, about }, { runValidators: true })
    .then((user) => {
      if (user) { return res.status(200).send({ data: user }); }
      return res.status(404).send({ message: 'Пользователь по указанному _id не найден.' });
    })
    .catch((err) => {
      validatorError(res, err, 'Переданы некорректные данные при обновлении профиля.');
    });
};

module.exports.patchAvatar = (req, res) => {
  const { avatar } = req.body;
  const owner = req.user._id;
  users.findByIdAndUpdate(owner, { avatar }, { runValidators: true })
    .then((user) => {
      if (user) { return res.status(200).send({ data: user }); }
      return res.status(404).send({ message: 'Пользователь по указанному _id не найден.' });
    })
    .catch((err) => {
      validatorError(res, err, 'Переданы некорректные данные при обновлении аватара.');
    });
};
