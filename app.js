const mongoose = require('mongoose');

mongoose.set('useUnifiedTopology', true);
const express = require('express');

const { PORT = 3000 } = process.env;
const app = express();
const bodyParser = require('body-parser');
const routeUsers = require('./routes/users');
const routeCards = require('./routes/cards');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const IncorrectDataError = require('./errors/incorrect-data-error');
const { requestLogger, errorLogger } = require('./middlewares/logger');

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(requestLogger);
app.post('/signin', login);
app.post('/signup', createUser);
app.use('/users', auth, routeUsers);
app.use('/cards', auth, routeCards);

app.use(errorLogger);
app.use((req, res) => {
  res.status(404).send({ message: 'Страница не найдена' });
});

app.use((err, req, res, next) => {
  if ((err.name === 'CastError') || (err.name === 'ValidationError')) {
    throw new IncorrectDataError('Переданы некорректные данные');
  }
  next(err);
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next(err);
});

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
