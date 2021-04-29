const express = require('express');
const router = express.Router();
const path = require('path');
const isAuth = require('../util/is_Auth');
const isntAuth = require('../util/isnt_Auth');
const {authRole} = require('../util/roles');

const usersController = require('../controller/usersController');

router.get('/login',isntAuth, usersController.getLogin);
router.post('/login', usersController.postLogin);
router.get('/logout', isAuth, usersController.getLogout);
router.get('/register', authRole(1), usersController.getRegister);
router.post('/register', authRole(1), usersController.postRegister);
router.get('/settings',isAuth, authRole(1), usersController.getSettings);
router.post('/settings',isAuth, authRole(1), usersController.postSettings);
router.post('/eliminar-usuario',isAuth, authRole(1), usersController.postEliminarUsuario);

router.use(express.static(path.join(__dirname, '..', 'public')));

module.exports = router;