const Casos_Uso = require('../models/casos_uso');
const Proyecto_Fase_Tarea = require('../models/Proyecto_Fase_Tarea');
const Entrega = require('../models/entrega');

exports.getTareaCasoUso = (request, response) =>{
    const id_proyecto = request.session.idProyecto;
    const id_iteracion = request.session.idIteracion;
    
    // Quiero (Casos de Uso)
    Casos_Uso.fetchQuiero(id_iteracion)
        .then(([rowsQ, fieldData]) => {
            // Todas las fases y tareas del proyecto
            Proyecto_Fase_Tarea.fetchAllTareasFaseProyecto(id_proyecto)
                .then(([rowsPFT, fieldData]) => {
                    response.render('tareaCasoUso', {
                        navegacion : request.session.navegacion,
                        proyecto_actual : request.session.nombreProyecto,
                        user: request.session.usuario,
                        title: "Tareas por Caso de Uso",
                        lista_quiero: rowsQ, 
                        lista_tareas: rowsPFT,
                        csrfToken: request.csrfToken()
                    });
                })
                .catch(err =>{
                    console.log(err);
                });
            })
        .catch( err => console.log(err));
}

exports.postObtenerTareas = (request, response) => {
    const id_caso = request.body.id_casos;
    const id_iteracion = request.session.idIteracion;
    const id_proyecto = request.session.idProyecto;
    
    Entrega.fetchTareaDeCaso(id_proyecto, id_iteracion, id_caso)
        .then(([tareasDelCaso, fieldData]) => {
            response.status(200).json(tareasDelCaso);
        })  
        .catch(err => {
            console.log(err);
        });  
}

exports.postModificarAsocioacion = (request, response) => {
    const id_proyecto = request.session.idProyecto;
    const id_fase = request.body.id_fase;
    const id_tarea = request.body.id_tarea;
    const id_caso = request.body.id_casos; 
    const accion = request.body.accion;

    if(accion === "registrar") {
        Entrega.crearEntrega(id_proyecto, id_fase, id_tarea, id_caso)
            .then(() => response.status(200))
            .catch( err => console.log(err));       
    }
    else if(accion === "eliminar") {
        Entrega.dropEntrega(id_proyecto, id_fase, id_tarea, id_caso)
            .then(() => response.status(200))
            .catch( err => console.log(err));
    }  
}

