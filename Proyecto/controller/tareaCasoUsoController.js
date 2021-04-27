const Casos_Uso = require('../models/casos_uso');
const Proyecto_Fase_Tarea = require('../models/Proyecto_Fase_Tarea');
const Entrega = require('../models/entrega');
const AP_Promedios = require('../models/ap_promedios');
const Proyecto = require('../models/proyecto');
const Airtable = require('airtable');

exports.getTareaCasoUso = (request, response) =>{
    const id_proyecto = request.session.idProyecto;
    const id_iteracion = request.session.idIteracion;

    let toast = request.session.toast;
    request.session.toast = "";
    
    // Quiero (Casos de Uso)
    Casos_Uso.fetchQuiero(id_iteracion)
        .then(([rowsQ, fieldData]) => {
            // Todas las fases y tareas del proyecto
            Proyecto_Fase_Tarea.fetchTareasNoFantasmas(id_proyecto)
                .then(([rowsPFT, fieldData]) => {
                    response.render('tareaCasoUso', {
                        imagen_empleado: request.session.imagen_empleado,
                        navegacion : request.session.navegacion,
                        proyecto_actual : request.session.nombreProyecto,
                        user: request.session.usuario,
                        title: "Tareas por Caso de Uso",
                        num_iteracion : request.session.numIteracion,
                        lista_quiero: rowsQ, 
                        lista_tareas: rowsPFT,
                        toast: toast,
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
    const id_casos = request.body.id_casos; 
    const accion = request.body.accion;

    if(accion === "registrar") {
        Casos_Uso.fetchOneAP(id_casos)
            .then(([rows, fieldData]) => {
                const id_ap = rows[0].id_ap;
                AP_Promedios.fetchPromedioMinutos(id_proyecto, id_fase, id_tarea, id_ap)
                    .then(([rows2, fieldData]) => {
                        let estimacion = rows2[0].promedio_minutos;
                        estimacion = (estimacion / 60).toFixed(2);
                        Entrega.crearEntrega(id_proyecto, id_fase, id_tarea, id_casos, estimacion)
                                    .then(() => {
                                        Entrega.actualiza_con_check(id_casos)
                                            .then(() => {
                                                response.status(200)
                                            })
                                    })
                                    .catch( err => console.log(err));
                    })
                    .catch(err =>{
                        console.log(err);
                    })
            })
            .catch(err => {
                console.log(err);
            });          
    }
    else if(accion === "eliminar") {
        Proyecto.fetchAirTableKeys(id_proyecto)
        .then(([rows, fielData]) => {
            if(!rows[0].base || !rows[0].API_key){
                Entrega.fetchIdAirtableDrop(id_proyecto, id_fase, id_tarea, id_casos)
                    .then(([rows2, fieldData]) => {
                        if(!rows2[0].id_airtable) {
                            Entrega.dropEntrega(id_proyecto, id_fase, id_tarea, id_casos)
                                .then(() => response.status(200))
                                .catch( err => console.log(err));
                        }
                        else {
                            request.session.toast = "No se puede eliminar la asociación, registra la base de Airtable correctamente para poder eliminarla.";
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    })
            }
            else{
                const base = new Airtable({apiKey: rows[0].API_key}).base( rows[0].base);
                Entrega.fetchIdAirtableDrop(id_proyecto, id_fase, id_tarea, id_casos)
                    .then(([rows2, fieldData]) => {
                        if(!rows2[0].id_airtable) {
                            base('Tasks').destroy([rows2[0].id_airtable], function(err, deletedRecords) {
                                if (err) {
                                    console.error(err);
                                    return;
                                }
                                console.log('Deleted', deletedRecords.length, 'records');
                            });
                        }
                        else {
                            Entrega.dropEntrega(id_proyecto, id_fase, id_tarea, id_casos)
                                .then(() => response.status(200))
                                .catch( err => console.log(err));
                        }
                    })
                    .catch( err => console.log(err));
            }
        })
        .catch(err => {
            console.log(err);
        })
    }
}

