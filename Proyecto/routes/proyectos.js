const express = require('express');
const router = express.Router();
const path = require('path');
const isAuth = require('../util/is_Auth');

const proyectsController = require('../controller/proyectosController');

router.get('/nuevo-proyecto', isAuth, proyectsController.getNuevoProyecto);

router.get('/resumen-proyecto', isAuth, proyectsController.getResumenProyecto);

router.get('/casos-uso-proyecto', isAuth, proyectsController.getCasosUsoProyecto);

router.get('/fases-proyecto', isAuth, proyectsController.getFasesProyecto);

router.get('/avance-proyecto', isAuth, proyectsController.getAvanceProyecto);

router.get('/capacidad-equipo', isAuth, proyectsController.getCapacidadEquipo);

router.get('/tarea-caso-uso', isAuth, proyectsController.getTareaCasoUso);

router.get('/promedios-ap', isAuth, proyectsController.getPromediosAP);

router.get('/estimados-ap', isAuth, proyectsController.getEstimadosAP);


router.use(express.static(path.join(__dirname, '..', 'public')));

module.exports = router;