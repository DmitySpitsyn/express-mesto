const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const users = require('../models/user');
const NotFoundError = require('../errors/not-found-error');
const IncorrectDataError = require('../errors/incorrect-data-error');
const IncorrectLoginPasswordError = require('../errors/incorrect-login-password');

const saltRounds = 10;

module.exports.getUsers = (req, res, next) => {
  users.find({})
    .then((items) => {
      res.status(200).send(items);
    })
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  const { _id } = req.user;
  return users.findById(_id)
    .then((user) => {
      if (user) {
        return res.status(200).send(user);
      }
      throw new NotFoundError('Пользователь по указанному _id не найден.');
    }).catch(next);
};

module.exports.login = (req, res, next) => {
  const {
    email, password,
  } = req.body;
  if (!validator.isEmail(email)) {
    throw new IncorrectDataError('Введеный почтовый адрес некоректен');
  }
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
  if (!validator.isEmail(email)) {
    throw new IncorrectDataError('Введеный почтовый адрес некоректен');
  }
  bcrypt.hash(password, saltRounds).then((hash) => users.create({
    name, about, avatar, email, password: hash,
  }))
    .then((user) => res.send({ data: user }))
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
  users.findByIdAndUpdate(owner, { name, about }, { runValidators: true })
    .then((user) => {
      if (user) { return res.status(200).send({ data: user }); }
      throw new NotFoundError('Пользователь по указанному _id не найден.');
    })
    .catch(next);
};

module.exports.patchAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const owner = req.user._id;
  users.findByIdAndUpdate(owner, { avatar }, { runValidators: true })
    .then((user) => {
      if (user) { return res.status(200).send({ data: user }); }
      throw new NotFoundError('Пользователь по указанному _id не найден.');
    })
    .catch(next);
};
