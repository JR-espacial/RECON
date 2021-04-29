const express = require('express');
const router = express.Router();
const path = require('path');
const isAuth = require('../util/is_Auth');

const homeController = require('../controller/homeController');

router.post('/modificar-proyecto', isAuth, homeController.postEditarProyecto);
router.post('/eliminar-proyecto', isAuth, homeController.postEliminarProyecto);
router.get('/', isAuth, homeController.getHome);
router.post('/', isAuth, homeController.postProyectoID);


router.use(express.static(path.join(__dirname, '..', 'public')));

module.exports = router;