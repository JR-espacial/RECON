const Casos_Uso = require('../models/casos_uso');
const Proyecto_Fase_Tarea = require('../models/Proyecto_Fase_Tarea');

exports.getTareaCasoUso = (request, response) =>{
    const id_proyecto = request.session.idProyecto;
    const id_iteracion = request.session.idIteracion;
    
    Casos_Uso.fetchQuiero(id_iteracion)
        .then(([rowsQ, fieldData]) => {
            Proyecto_Fase_Tarea.fetchAllTareasFaseProyecto(id_proyecto)
                .then(([rowsPFT, fieldData]) => {
                    response.render('tareaCasoUso', {
                        title: "Tareas por Caso de Uso",
                        lista_quiero: rowsQ, 
                        lista_tareas: rowsPFT,
                        csrfToken: request.csrfToken()
                    });
                })
                .catch(err => {
                    console.log(err);
                });
        })
        .catch(err =>{
            console.log(err);
        })
}