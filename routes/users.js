const routeUsers = require('express').Router();

const {
  getUsers, getUser, patchUser, patchAvatar, getUserMe,
} = require('../controllers/users');

routeUsers.get('/users', getUsers);
routeUsers.get('/users/:id', getUser);
routeUsers.get('/users/me', getUserMe);
routeUsers.patch('/users/me', patchUser);
routeUsers.patch('/users/me/avatar', patchAvatar);

module.exports = routeUsers;
