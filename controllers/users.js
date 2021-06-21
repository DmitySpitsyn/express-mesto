const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const users = require('../models/user');
const NotFoundError = require('../errors/not-found-error');
const IncorrectDataError = require('../errors/incorrect-data-error');
const IncorrectLoginPasswordError = require('../errors/incorrect-login-password');

const saltRounds = 10;

function validatorFields(email, password) {
  if ((!email) || (!password)) { throw new IncorrectDataError('Не заполнены обязательные поля'); }
  if ((!(typeof (password) === 'string')) || (!(typeof (email) === 'string'))) { throw new IncorrectDataError('В одно из полей переданны некорректные данные'); }
  if (!validator.isEmail(email)) {
    throw new IncorrectDataError('Введеный почтовый адрес некоректен');
  }
}

module.exports.getUsers = (req, res, next) => {
  users.find({})
    .then((items) => {
      res.status(200).send(items);
    })
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  const { userId } = req.params;
  users.findById(userId)
    .then((user) => {
      res.status(200).send(user);
    })
    .catch(next);
};

module.exports.getUserMe = (req, res, next) => {
  const { _id } = req.user;
  users.findById(_id)
    .then((user) => {
      res.status(200).send(user);
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const {
    email, password,
  } = req.body;
  validatorFields(email, password);
  return users.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, '206b149e0530995fa78d83d588e69363a2182047b78f05f944c6b5b75e49c6f1');
      res.status(200).send({ token });
      //  res.cookie('jwt', token, {
      //    httpOnly: true,
      //  })
      //   .end();
    }).catch(() => {
      throw new IncorrectLoginPasswordError('Неверный логин или пароль');
    }).catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  validatorFields(email, password);
  bcrypt.hash(password, saltRounds).then((hash) => users.create({
    name, about, avatar, email, password: hash,
  }))
    .then((user) => {
      users.findById(user._id)
        .then((item) => res.send({ data: item }));
    })
    .catch((err) => {
      if (err.name === 'MongoError' && err.code === 11000) {
        const error = new Error('Пользователь существует');
        error.statusCode = 409;
        next(error);
      }
    })
    .catch(next);
};

module.exports.patchUser = (req, res, next) => {
  const { name, about } = req.body;
  const owner = req.user._id;
  users.findById(owner).then((user) => {
    if (!user) { throw new NotFoundError('Пользователь по указанному _id не найден.'); }
    if ((!name) || (!about)) { throw new IncorrectDataError('Не заполнены обязательные поля'); }
    users.findOneAndUpdate({ _id: owner }, { $set: { name, about } },
      { runValidators: true, new: true },
      (err, item) => {
        if (err) {
          const error = new Error('Ошибка валидации');
          error.statusCode = 400;
          next(error);
        }
        res.send(item);
      });
  }).catch(next);
};

module.exports.patchAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const owner = req.user._id;
  users.findById(owner).then((user) => {
    if (!user) { throw new NotFoundError('Пользователь по указанному _id не найден.'); }
    if (!avatar) { throw new IncorrectDataError('Не заполнены обязательные поля'); }
    if (!validator.isURL(avatar)) { throw new IncorrectDataError('Введенный URL не коректен'); }
    users.findOneAndUpdate({ _id: owner }, { $set: { avatar } }, { runValidators: true, new: true },
      (err, item) => {
        if (err) {
          const error = new Error('Ошибка валидации');
          error.statusCode = 400;
          next(error);
        }
        res.send(item);
      });
  }).catch(next);
};
