const Proyecto_Fase_Tarea = require('../models/Proyecto_Fase_Tarea');
const Fase = require('../models/fase');
const Tarea = require('../models/tarea');
const Proyecto = require('../models/proyecto');
const Entrega = require('../models/entrega');

exports.getFasesProyecto = (request, response) =>{
    const id_proyecto = request.session.idProyecto;
    let alerta = request.session.alerta;
    let toast = request.session.toast;
    request.session.alerta = "";
    request.session.toast = "";
    Proyecto_Fase_Tarea.fetchAllTareasFaseProyecto(id_proyecto)
        .then(([rows, fieldData]) => {
            
            Fase.fetchAllNotInProject(id_proyecto)
                .then(([rows2, fieldData]) => {
                    Proyecto.fetchAirTableKeys(id_proyecto)
                        .then(([rows3, fieldData]) => {
                            response.render('fasesProyecto', {
                                navegacion : request.session.navegacion,
                                proyecto_actual : request.session.nombreProyecto,
                                imagen_empleado: request.session.imagen_empleado,
                                user: request.session.usuario,
                                title: "Fases del Proyecto",
                                lista_tareas: rows,
                                sugerencia_fases: rows2,
                                proyecto_keys : rows3[0],
                                alerta: alerta,
                                toast: toast,
                                csrfToken: request.csrfToken()
                            });
                        })
                        .catch(err => {
                            console.log(err);
                        });     
                })
                .catch(err => {
                    console.log(err);
                });   
        })
        .catch(err => {
            console.log(err);
        });                            
}

exports.postFasesProyecto = (request, response) => {
    const id_proyecto = request.session.idProyecto * 1;
    let accion = request.body.action;
    
    if (accion === "registrar-fase") {
        let nombre_fase = request.body.añadir_nombre_fase;
        
        Fase.fetchOne(nombre_fase)
            .then(([rows, fieldData]) => {
                // Si fase ya existe en algún proyecto
                if(rows.length > 0){
                    let proyecto_fase_tarea = new Proyecto_Fase_Tarea(id_proyecto, rows[0].id_fase, 0);
                    proyecto_fase_tarea.saveProyecto_Fase_Tarea()
                        .then(() => {
                            response.redirect('fases-proyecto');
                            request.session.toast = "Fase registrada";
                        })
                        .catch( err => {
                            request.session.alerta = nombre_fase + " ya existe dentro del Proyecto.";
                            response.redirect('fases-proyecto');
                        });
                }
                // Si aún no existe una fase con el nombre ingresado
                else{
                    let fase = new Fase(nombre_fase);
                    fase.saveFase()
                        .then(() => {
                            Fase.fetchOne(nombre_fase) 
                                .then(([rows2, fieldData]) => {
                                    let id_fase = rows2[0].id_fase;
                                    let proyecto_fase_tarea = new Proyecto_Fase_Tarea(id_proyecto, id_fase, 0);
                                    proyecto_fase_tarea.saveProyecto_Fase_Tarea()
                                        .then(() => {
                                            request.session.toast = "Fase registrada";
                                            response.redirect('fases-proyecto');
                                        })
                                        .catch( err => {
                                            console.log(err);
                                        }); 
                                })
                                .catch(err => {
                                    console.log(err);
                                });
                        })
                        .catch( err => {
                            console.log(err);
                        }); 
                }
            })
            .catch( err => {
                console.log(err);
            }); 
    }

    else if(accion === "registrar-tarea"){
        const id_fase = request.body.id_fase;
        const nombre_tarea = request.body.añadir_nombre_tarea;
        Tarea.fetchOne(nombre_tarea)
            .then(([rows, fieldData]) => {
                if(rows.length > 0){
                    const proyecto_fase_tarea = new Proyecto_Fase_Tarea(id_proyecto, id_fase, rows[0].id_tarea);
                    proyecto_fase_tarea.saveProyecto_Fase_Tarea()
                        .then(() => {
                            request.session.toast = "Tarea registrada";                     
                            response.redirect('fases-proyecto');
                        })
                        .catch(err => {
                            // Chequear error ya existe en fase
                            request.session.alerta = nombre_tarea + " ya existe dentro de la Fase.";
                            response.redirect('fases-proyecto');
                        });
                }
                else{
                    const tarea = new Tarea(nombre_tarea);
                    tarea.saveTarea()
                        .then(() => {
                            Tarea.fetchOne(nombre_tarea)
                                .then(([rows2, fieldData]) => {
                                    const id_tarea = rows2[0].id_tarea;
                                    const proyecto_fase_tarea = new Proyecto_Fase_Tarea(id_proyecto, id_fase, id_tarea);
                                    proyecto_fase_tarea.saveProyecto_Fase_Tarea()
                                        .then(() => {
                                            request.session.toast = "Tarea registrada";
                                            response.redirect('fases-proyecto');  
                                        })
                                        .catch(err => {
                                            console.log(err);
                                        });
                                })
                                .catch(err => {
                                    console.log(err);
                                });
                        })
                        .catch(err => {
                            console.log(err);
                        });
                }
            })
            .catch(err => {
                console.log(err);
            }); 
    }

    else if (accion === "eliminar-fase") {
        const id_fase = request.body.id_fase;

        Entrega.fetchEntregaFase(id_proyecto, id_fase)
            .then(([rows, fieldData]) => {
                if (rows.length > 0) {
                    request.session.alerta = "No se puede eliminar esta fase debido a que fue utilizada para estimar un caso de uso del Proyecto.";
                }
                else {
                    Proyecto_Fase_Tarea.deleteFaseFromProject(id_proyecto, id_fase)
                        .then(() => {
                            request.session.toast = "Fase Eliminada";
                        })
                        .catch(err => {
                            console.log(err);
                        });                         
                }
                response.redirect('fases-proyecto');
            })
            .catch(err => {
                console.log(err);
            });
    }

    else if(accion === "eliminar-tarea"){
        const id_fase = request.body.id_fase;
        const id_tarea = request.body.id_tarea;

        Entrega.fetchEntregaTarea(id_proyecto, id_fase, id_tarea)
            .then(([rows, fieldData]) => {
                if (rows.length > 0) {
                    request.session.alerta = "No se puede eliminar esta tarea debido a que fue utilizada para estimar un caso de uso del Proyecto.";
                }
                else {
                    Proyecto_Fase_Tarea.deleteTareaFromFase(id_proyecto, id_fase, id_tarea)
                        .then(() => {
                            request.session.toast = "Tarea Eliminada.";
                        })
                        .catch(err => {
                            console.log(err);
                        });                            
                }
                response.redirect('fases-proyecto');
            })
            .catch(err => {
                console.log(err);
            });
    }
} 