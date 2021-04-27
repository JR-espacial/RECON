const express = require('express');
const router = express.Router();
const path = require('path');
const isAuth = require('../util/is_Auth');

const proyectosController = require('../controller/proyectosController');
const iteracionesController = require('../controller/iteracionesController');
const casos_usoController = require('../controller/casos_usoController');
const fasesController = require('../controller/fasesController');
const tareaCasosUsoController = require('../controller/tareaCasoUsoController');
const avanceIteracionController = require('../controller/avanceIteracionController');
const capacidadController = require('../controller/capacidadController');
const enviarAirtableController = require('../controller/enviarAirtableController');


router.post('/nuevo-departamento', isAuth, proyectosController.postNuevoDepartamento);

router.get('/nuevo-proyecto', isAuth, proyectosController.getNuevoProyecto);

router.post('/nuevo-proyecto', isAuth, proyectosController.postNuevoProyecto);

router.get('/fases-proyecto', isAuth, fasesController.getFasesProyecto);

router.post('/fases-proyecto', isAuth, fasesController.postFasesProyecto);

router.get('/avance-proyecto', isAuth, avanceIteracionController.getAvanceProyecto);

router.get('/estimacion-ap', isAuth, proyectosController.getEstimacionAP);

router.post('/estimacion-ap', isAuth, proyectosController.postEstimacionAP);

router.post('/estimacion-ap/promedios-ap', isAuth, proyectosController.postPromediosAP);

router.get('/iteraciones-desarrollo-proyecto', isAuth,iteracionesController.getIteracionesDesarrolloProyecto);

router.get('/iteraciones-terminadas-proyecto', isAuth,iteracionesController.getIteracionesTerminadasProyecto);

router.post('/iteraciones-proyecto', isAuth,iteracionesController.postIteracionesProyecto);

router.post('/iteraciones-proyecto-editar', isAuth,iteracionesController.postChipsIteracionesProyecto);

router.get('/nueva-iteracion', isAuth,iteracionesController.getNuevaIteracion);

router.post('/nueva-iteracion', isAuth,iteracionesController.postNuevaIteracion);

router.post('/modificar-iteracion', isAuth, iteracionesController.postEditarIteracion);

router.post('/eliminar-iteracion', isAuth, iteracionesController.postEliminarIteracion);

router.post('/terminar-iteracion', isAuth, iteracionesController.postTerminarIteracion);

router.post('/configuracion-AirTable', isAuth, iteracionesController.postAirTableKeys);

router.get('/capacidad-equipo', isAuth, capacidadController.getCapacidadEquipo);

router.post('/modificar-horas-colaborador', isAuth, capacidadController.postModificarHorasColaborador);

router.post('/modificar-porcentaje-tiempo-perdido', isAuth, capacidadController.postModificarPorcentajeTiempoPerdido);

router.post('/modificar-porcentaje-errores-registro', isAuth, capacidadController.postModificarPorcentajeErroresRegistro);

router.post('/modificar-porcentaje-overhead', isAuth, capacidadController.postModificarPorcentajeOverhead);

router.post('/modificar-porcentaje-productivas', isAuth, capacidadController.postModificarPorcentajeProductivas);

router.post('/modificar-porcentaje-operativos', isAuth, capacidadController.postModificarPorcentajeOperativos);

router.post('/modificar-porcentaje-humano', isAuth, capacidadController.postModificarPorcentajeHumano);

router.post('/modificar-porcentaje-cmmi', isAuth, capacidadController.postModificarPorcentajeCMMI);

router.get('/casos-uso-iteracion', isAuth, casos_usoController.getCasosUsoIteracion);

router.post('/casos-uso-iteracion', isAuth, casos_usoController.postCasosUsoIteracion);

router.get('/tarea-caso-uso', isAuth, tareaCasosUsoController.getTareaCasoUso);

router.post('/tarea-caso-uso/obtener-tareas', isAuth, tareaCasosUsoController.postObtenerTareas);

router.post('/tarea-caso-uso/modificarAsociacion', isAuth, tareaCasosUsoController.postModificarAsocioacion);

router.post('/tarea-caso-uso/enviarAirtable', isAuth, enviarAirtableController.postEnviarDatosAirtable);

router.use(express.static(path.join(__dirname, '..', 'public')));

module.exports = router;