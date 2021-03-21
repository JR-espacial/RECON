const express = require('express');
const router = express.Router();
const path = require('path');
const isAuth = require('../util/is_Auth');

const proyectosController = require('../controller/proyectosController');
const iteracionesController = require('../controller/iteracionesController');
const casos_usoController = require('../controller/casos_usoController');
const fasesController = require('../controller/fasesController');


router.get('/nuevo-proyecto', isAuth, proyectosController.getNuevoProyecto);

router.post('/nuevo-proyecto', isAuth, proyectosController.postNuevoProyecto);

router.get('/resumen-proyecto', isAuth, proyectosController.getResumenProyecto);

router.get('/fases-proyecto', isAuth, fasesController.getFasesProyecto);

router.get('/avance-proyecto', isAuth, proyectosController.getAvanceProyecto);

router.get('/promedios-ap', isAuth, proyectosController.getPromediosAP);

router.get('/estimados-ap', isAuth, proyectosController.getEstimadosAP);

router.get('/iteraciones-proyecto', isAuth,iteracionesController.getIteracionesProyecto);

router.post('/iteraciones-proyecto', isAuth,iteracionesController.postIteracionesProyecto);

router.get('/nueva-iteracion', isAuth,iteracionesController.getNuevaIteracion);

router.post('/nueva-iteracion', isAuth,iteracionesController.postNuevaIteracion);

router.get('/capacidad-equipo', isAuth, iteracionesController.getCapacidadEquipo);

router.get('/casos-uso-iteracion', isAuth, casos_usoController.getCasosUsoIteracion);

router.post('/casos-uso-iteracion', isAuth, casos_usoController.postCasosUsoIteracion);

router.get('/tarea-caso-uso', isAuth, casos_usoController.getTareaCasoUso);


router.use(express.static(path.join(__dirname, '..', 'public')));

module.exports = router;