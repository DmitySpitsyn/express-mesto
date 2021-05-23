const User = require('../models/user');
const router = require('express').Router();
const { getUser, getUserId, createUser } = require('../controllers/films');

router.get('/users', getUser);
router.get('/users/:userId', getUserId);
router.post('/users', createUser);