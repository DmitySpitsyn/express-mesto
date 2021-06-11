const routeUsers = require('express').Router();

const {
  getUsers, getUser, patchUser, patchAvatar,
} = require('../controllers/users');

routeUsers.get('/', getUsers);
routeUsers.get('/me', getUser);
routeUsers.patch('/me', patchUser);
routeUsers.patch('/me/avatar', patchAvatar);

module.exports = routeUsers;
