const Casos_Uso = require('../models/casos_uso');
const Proyecto_Fase_Tarea = require('../models/Proyecto_Fase_Tarea');
const Entrega = require('../models/entrega');

exports.getTareaCasoUso = (request, response) =>{
    const id_proyecto = request.session.idProyecto;
    const id_iteracion = request.session.idIteracion;

    // Con este id se buscaran las tareas que le pertenecen para desplegar los checks
    if(!request.session.idCaso_tareasCU) {
        request.session.idCaso_tareasCU = 0;
    }
    const id_CasoParaTarea = request.session.idCaso_tareasCU;
    request.session.idCaso_tareasCU = 0;
    
    Casos_Uso.fetchQuiero(id_iteracion)
        .then(([rowsQ, fieldData]) => {
            Proyecto_Fase_Tarea.fetchAllTareasFaseProyecto(id_proyecto)
                .then(([rowsPFT, fieldData]) => {
                    Entrega.fetchTareaDeCaso(id_CasoParaTarea)
                        .then(([tareasDelCaso, fieldData]) => {
                            console.log(tareasDelCaso);
                            response.render('tareaCasoUso', {
                                title: "Tareas por Caso de Uso",
                                lista_quiero: rowsQ, 
                                lista_tareas: rowsPFT,
                                tareas_Caso: tareasDelCaso,
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
        .catch(err =>{
            console.log(err);
        });
}

exports.postTareaCasoUso = (request, response) => {
    request.session.idCaso_tareasCU = request.body.idCaso;

    response.redirect('/proyectos/tarea-caso-uso')
}