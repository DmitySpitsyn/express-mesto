const routeUsers = require('express').Router();
const { getUsers, getUser, createUser, patchUser, patchAvatar } = require('../controllers/users');

routeUsers.get('/users', getUsers);
routeUsers.get('/users/:id', getUser);
routeUsers.post('/users', createUser);
routeUsers.patch('/users/me', patchUser);
routeUsers.patch('/users/me/avatar', patchAvatar);

module.exports = routeUsers;