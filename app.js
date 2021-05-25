const express = require('express');
const mongoose = require('mongoose');
const { PORT = 3000 } = process.env;
const app = express();
const bodyParser = require('body-parser');
const routeUsers = require('./routes/users');
const routeCards = require('./routes/cards');
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/mestodb', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
});

app.use((req, res, next) => {
    req.user = {
        _id: '60abe580cd878826cc371ae9' // вставьте сюда _id созданного в предыдущем пункте пользователя
    };

    next();
});

app.use('/', routeUsers);
app.use('/', routeCards);

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
})