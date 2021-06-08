const mongoose = require('mongoose');

mongoose.set('useUnifiedTopology', true);
const express = require('express');
const path = require('path');

const { PORT = 3000 } = process.env;
const app = express();
const bodyParser = require('body-parser');
const routeUsers = require('./routes/users');
const routeCards = require('./routes/cards');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(express.static(path.join(__dirname, 'public')));
app.post('/signin', login);
app.post('/signup', createUser);
app.use(auth);
app.use('/', routeUsers);
app.use('/', routeCards);

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
