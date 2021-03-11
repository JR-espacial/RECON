const express = require('express');
const router = express.Router();
const path = require('path');

const usersController = require('../controller/usersController');

router.get('/login', usersController.getLogin);
router.post('/login', usersController.postLogin);
router.get('/logout', usersController.getLogout);


router.use(express.static(path.join(__dirname, '..', 'public')));

module.exports = router;