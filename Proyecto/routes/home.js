const express = require('express');
const router = express.Router();
const path = require('path');
const isAuth = require('../util/is_Auth');
const {authRole} = require('../util/roles');

const homeController = require('../controller/homeController');

router.post('/modificar-proyecto', isAuth, authRole(1), homeController.postEditarProyecto);
router.post('/eliminar-proyecto', isAuth, authRole(1), homeController.postEliminarProyecto);
router.get('/manual-usuario', isAuth, homeController.getManualUsuario);
router.get('/acces-denied', isAuth, homeController.getAccesDenied); 
router.get('/', isAuth, homeController.getHome);
router.post('/', isAuth, homeController.postProyectoID);

router.use(express.static(path.join(__dirname, '..', 'public')));

module.exports = router;