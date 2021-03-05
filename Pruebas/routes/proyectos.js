const express = require('express');
const router = express.Router();
const path = require('path');

const proyectsController = require('../controller/proyectosController');

router.get('/nuevo-proyecto', proyectsController.getNuevoProyecto);

router.get('/resumen-proyecto', proyectsController.getResumenProyecto);

router.get('/casos-uso-proyecto', proyectsController.getCasosUsoProyecto);

router.get('/fases-proyecto', proyectsController.getFasesProyecto);

router.get('/capacidad-equipo', proyectsController.getCapacidadEquipo);

router.use(express.static(path.join(__dirname, '..', 'public')));

module.exports = router;