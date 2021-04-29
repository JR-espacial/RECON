const express = require('express');
const router = express.Router();
const path = require('path');
const isAuth = require('../util/is_Auth');
const {authRole} = require('../util/roles');

const proyectosController = require('../controller/proyectosController');
const iteracionesController = require('../controller/iteracionesController');
const casos_usoController = require('../controller/casos_usoController');
const fasesController = require('../controller/fasesController');
const tareaCasosUsoController = require('../controller/tareaCasoUsoController');
const avanceIteracionController = require('../controller/avanceIteracionController');
const capacidadController = require('../controller/capacidadController');
const enviarAirtableController = require('../controller/enviarAirtableController');
const homeController = require('../controller/homeController');


router.get('/mi-progreso', isAuth, authRole(1), iteracionesController.getMiprogreso);

router.post('/nuevo-departamento', isAuth, authRole(1),  proyectosController.postNuevoDepartamento);

router.get('/nuevo-proyecto', isAuth, authRole(1), proyectosController.getNuevoProyecto);

router.post('/nuevo-proyecto', isAuth, authRole(1), proyectosController.postNuevoProyecto);

router.get('/fases-proyecto', isAuth, authRole(1), fasesController.getFasesProyecto);

router.post('/fases-proyecto', isAuth, authRole(1), fasesController.postFasesProyecto);

router.get('/avance-proyecto', isAuth, authRole(1), avanceIteracionController.getAvanceProyecto);

router.get('/estimacion-ap', isAuth, authRole(1), proyectosController.getEstimacionAP);

router.post('/estimacion-ap', isAuth, authRole(1), proyectosController.postEstimacionAP);

router.post('/estimacion-ap/promedios-ap', isAuth, authRole(1), proyectosController.postPromediosAP);

router.get('/iteraciones-desarrollo-proyecto', isAuth, authRole(1), iteracionesController.getIteracionesDesarrolloProyecto);

router.get('/iteraciones-terminadas-proyecto', isAuth, authRole(1), iteracionesController.getIteracionesTerminadasProyecto);

router.post('/iteraciones-proyecto', isAuth, authRole(1), iteracionesController.postIteracionesProyecto);

router.post('/iteraciones-proyecto-editar', isAuth, authRole(1), iteracionesController.postChipsIteracionesProyecto);

router.get('/nueva-iteracion', isAuth, authRole(1), iteracionesController.getNuevaIteracion);

router.post('/nueva-iteracion', isAuth, authRole(1), iteracionesController.postNuevaIteracion);

router.post('/modificar-iteracion', isAuth, authRole(1), iteracionesController.postEditarIteracion);

router.post('/eliminar-iteracion', isAuth, authRole(1), iteracionesController.postEliminarIteracion);

router.post('/terminar-iteracion', isAuth, authRole(1), iteracionesController.postTerminarIteracion);

router.post('/configuracion-AirTable', isAuth, authRole(1), iteracionesController.postAirTableKeys);

router.get('/capacidad-equipo', isAuth, authRole(1), capacidadController.getCapacidadEquipo);

router.post('/modificar-horas-colaborador', isAuth, authRole(1), capacidadController.postModificarHorasColaborador);

router.post('/modificar-porcentaje-tiempo-perdido', isAuth, authRole(1), capacidadController.postModificarPorcentajeTiempoPerdido);

router.post('/modificar-porcentaje-errores-registro', isAuth, authRole(1),  capacidadController.postModificarPorcentajeErroresRegistro);

router.post('/modificar-porcentaje-overhead', isAuth, authRole(1), capacidadController.postModificarPorcentajeOverhead);

router.post('/modificar-porcentaje-productivas', isAuth, authRole(1), capacidadController.postModificarPorcentajeProductivas);

router.post('/modificar-porcentaje-operativos', isAuth, authRole(1), capacidadController.postModificarPorcentajeOperativos);

router.post('/modificar-porcentaje-humano', isAuth, authRole(1), capacidadController.postModificarPorcentajeHumano);

router.post('/modificar-porcentaje-cmmi', isAuth, authRole(1), capacidadController.postModificarPorcentajeCMMI);

router.get('/casos-uso-iteracion', isAuth, authRole(1), casos_usoController.getCasosUsoIteracion);

router.post('/casos-uso-iteracion', isAuth, authRole(1), casos_usoController.postCasosUsoIteracion);

router.get('/tarea-caso-uso', isAuth, authRole(1), tareaCasosUsoController.getTareaCasoUso);

router.post('/tarea-caso-uso/obtener-tareas', isAuth, authRole(1), tareaCasosUsoController.postObtenerTareas);

router.post('/tarea-caso-uso/modificarAsociacion', isAuth, authRole(1), tareaCasosUsoController.postModificarAsocioacion);

router.post('/tarea-caso-uso/enviarAirtable', isAuth, authRole(1), enviarAirtableController.postEnviarDatosAirtable);

router.use(express.static(path.join(__dirname, '..', 'public')));

module.exports = router;