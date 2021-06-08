const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const users = require('../models/user');

const saltRounds = 10;

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

module.exports.getUserMe = (req, res) => {
  const {
    email, password,
  } = req.body;
  console.log(_id);
  return users.findById(_id)
    .then((items) => {
      res.status(200).send({ data: items });
    })
    .catch(() => res.status(500).send({ message: 'Ошибка по-умолчанию' }));
};

module.exports.getUser = (req, res) => {
  const { id } = req.params;
  return users.findById(id)
    .then((user) => {
      if (user) {
        return res.status(200).send({
          name: user.name, about: user.about, avatar: user.avatar, _id: user._id,
        });
      }
      return res.status(404).send({ message: 'Пользователь по указанному _id не найден.' });
    })
    .catch(() => {
      res.status(500).send({ message: 'Ошибка по-умолчанию' });
    });
};

module.exports.login = (req, res) => {
  const {
    email, password,
  } = req.body;
  return users.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, '206b149e0530995fa78d83d588e69363a2182047b78f05f944c6b5b75e49c6f1');
      console.log(user._id);
      res.status(200).send({ token });
      //  res.cookie('jwt', token, {
      //    httpOnly: true,
      //  })
      //   .end();
    }).catch((err) => { res.status(401).send({ message: err.message }); });
};

module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, saltRounds).then((hash) => users.create({
    name, about, avatar, email, password: hash,
  }))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      validatorError(res, err, 'Переданы некорректные данные при создании пользователя.');
    });
};

module.exports.patchUser = (req, res) => {
  const { name, about } = req.body;
  const owner = req.user._id;
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
