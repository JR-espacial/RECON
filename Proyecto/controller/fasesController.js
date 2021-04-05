const Proyecto_Fase_Tarea = require('../models/Proyecto_Fase_Tarea');
const Fase = require('../models/fase');
const Tarea = require('../models/tarea');

exports.getFasesProyecto = (request, response) =>{
    const id_proyecto = request.session.idProyecto;
    let alerta = request.session.alerta;
    request.session.alerta = "";
    Proyecto_Fase_Tarea.fetchAllTareasFaseProyecto(id_proyecto)
        .then(([rows, fieldData]) => {
            
            Fase.fetchAllNotInProject(id_proyecto)
                .then(([rows2, fieldData]) => {
                    response.render('fasesProyecto', {
                        user: request.session.usuario,
                        title: "Fases del Proyecto",
                        lista_tareas: rows,
                        sugerencia_fases: rows2,
                        alerta: alerta,
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

    if(accion === "registrar-tarea"){
        const id_fase = request.body.id_fase;
        const nombre_tarea = request.body.añadir_nombre_tarea;
        Tarea.fetchOne(nombre_tarea)
            .then(([rows, fieldData]) => {
                if(rows.length > 0){
                    const proyecto_fase_tarea = new Proyecto_Fase_Tarea(id_proyecto, id_fase, rows[0].id_trabajo);
                    proyecto_fase_tarea.saveProyecto_Fase_Tarea()
                        .then(() => {
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
                                .then(([rows, fieldData]) => {
                                    const id_tarea = rows[0].id_trabajo;
                                    const proyecto_fase_tarea = new Proyecto_Fase_Tarea(id_proyecto, id_fase, id_tarea);
                                    proyecto_fase_tarea.saveProyecto_Fase_Tarea()
                                        .then(() => {
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
}