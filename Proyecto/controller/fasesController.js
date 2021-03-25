const Proyecto_Fase_Tarea = require('../models/Proyecto_Fase_Tarea');
const Fase = require('../models/fase');
const Tarea = require('../models/tarea');

exports.getFasesProyecto = (request, response) =>{
    const id_proyecto = request.session.idProyecto;

    Proyecto_Fase_Tarea.fetchAllTareasFaseProyecto(id_proyecto)
        .then(([rows, fieldData]) => {
            response.render('fasesProyecto', {
                title: "Fases del Proyecto",
                lista_tareas: rows,
                csrfToken: request.csrfToken()
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
        let fase = new Fase(nombre_fase);

        fase.saveFase()
            .then(() => {
                Fase.fetchOne(nombre_fase) 
                    .then(([rows, fieldData]) => {
                        let id_fase = rows[0].id_fase;
                        let proyecto_fase_tarea = new Proyecto_Fase_Tarea(id_proyecto, id_fase, 1);
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

    if(accion === "registrar-tarea"){
        const id_fase = request.body.id_fase;
        const nombre_tarea = request.body.añadir_nombre_tarea;
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

}