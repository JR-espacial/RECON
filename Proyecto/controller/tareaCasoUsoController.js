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
    
    Casos_Uso.fetchQuiero(id_iteracion)
        .then(([rowsQ, fieldData]) => {
            Proyecto_Fase_Tarea.fetchAllTareasFaseProyecto(id_proyecto)
                .then(([rowsPFT, fieldData]) => {
                    console.log(rowsPFT.length);
                    console.log(rowsPFT);
                    Entrega.fetchTareaDeCaso(id_CasoParaTarea)
                        .then(([tareasDelCaso, fieldData]) => {
                            response.render('tareaCasoUso', {
                                navegacion : request.session.navegacion,
                                proyecto_actual : request.session.nombreProyecto,
                                user: request.session.usuario,
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
    let action = request.body.action;
    if(action === "cambiar") {
        let checks = request.body.checks;
        const check = checks.split(',');
        let idsPractica = request.body.idspractica; 
        const ids = idsPractica.split(',');
        console.log(idsPractica);
        console.log(checks);
        console.log(ids.length);
        console.log(check.length);
        for(let i = 0; i < check.length; i++){
            //console.log(ids[i]);
            if(check[i] == 1){
                console.log('Creado');
                /*Entrega.crearEntrega(request.session.idCaso_tareasCU, idsPractica[i])
                    .then(() => {
                        console.log('Entrega creada');
                    })
                    .catch(err => {
                        console.log(err);
                    });*/
            }else{
                console.log('Eliminado');
               /*Entrega.dropEntrega(request.session.idCaso_tareasCU, idsPractica[i])
                    .then(() => {
                        console.log('Entrega eliminada');
                    })
                    .catch( err => {
                        console.log(err);
                    });*/
            }
        }
        response.redirect('/proyectos/tarea-caso-uso');
    }
    else if(action === "consultar") {
        request.session.idCaso_tareasCU = request.body.idCaso;
        response.redirect('/proyectos/tarea-caso-uso');
    }
}