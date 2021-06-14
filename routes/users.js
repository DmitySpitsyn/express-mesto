const routeUsers = require('express').Router();

const {
  getUsers, patchUser, patchAvatar, getUser,
} = require('../controllers/users');

routeUsers.get('/', getUsers);
routeUsers.get('/:userId', getUser);
routeUsers.patch('/me', patchUser);
routeUsers.patch('/me/avatar', patchAvatar);

module.exports = routeUsers;
