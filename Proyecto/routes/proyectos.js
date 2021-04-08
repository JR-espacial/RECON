const express = require('express');
const router = express.Router();
const path = require('path');
const isAuth = require('../util/is_Auth');

const proyectosController = require('../controller/proyectosController');
const iteracionesController = require('../controller/iteracionesController');
const casos_usoController = require('../controller/casos_usoController');
const fasesController = require('../controller/fasesController');
const tareaCasosUsoController = require('../controller/tareaCasoUsoController');
const testController = require('../controller/test_Controller');

router.get('/test', isAuth,testController.getTest)

router.get('/nuevo-proyecto', isAuth, proyectosController.getNuevoProyecto);

router.post('/nuevo-proyecto', isAuth, proyectosController.postNuevoProyecto);

router.get('/resumen-proyecto', isAuth, proyectosController.getResumenProyecto);

router.get('/fases-proyecto', isAuth, fasesController.getFasesProyecto);

router.post('/fases-proyecto', isAuth, fasesController.postFasesProyecto);

router.get('/avance-proyecto', isAuth, proyectosController.getAvanceProyecto);

router.get('/promedios-ap', isAuth, proyectosController.getPromediosAP);

router.get('/estimados-ap', isAuth, proyectosController.getEstimadosAP);

router.get('/iteraciones-desarrollo-proyecto', isAuth,iteracionesController.getIteracionesDesarrolloProyecto);

router.get('/iteraciones-terminadas-proyecto', isAuth,iteracionesController.getIteracionesTerminadasProyecto);

router.post('/iteraciones-proyecto', isAuth,iteracionesController.postIteracionesProyecto);

router.post('/iteraciones-proyecto-editar', isAuth,iteracionesController.postChipsIteracionesProyecto);

router.get('/nueva-iteracion', isAuth,iteracionesController.getNuevaIteracion);

router.post('/nueva-iteracion', isAuth,iteracionesController.postNuevaIteracion);

router.post('/modificar-iteracion', isAuth, iteracionesController.postEditarIteracion);

router.post('/eliminar-iteracion', isAuth, iteracionesController.postEliminarIteracion);

router.post('/terminar-iteracion', isAuth, iteracionesController.postTerminarIteracion);

router.get('/capacidad-equipo', isAuth, iteracionesController.getCapacidadEquipo);

router.get('/casos-uso-iteracion', isAuth, casos_usoController.getCasosUsoIteracion);

router.post('/casos-uso-iteracion', isAuth, casos_usoController.postCasosUsoIteracion);

router.get('/tarea-caso-uso', isAuth, tareaCasosUsoController.getTareaCasoUso);

// router.post('/tarea-caso-uso', isAuth, tareaCasosUsoController.postTareaCasoUso);

router.post('/tarea-caso-uso/obtener-tareas', isAuth, tareaCasosUsoController.postObtenerTareas);

router.use(express.static(path.join(__dirname, '..', 'public')));

module.exports = router;