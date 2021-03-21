const Casos_Uso = require('../models/casos_uso');

exports.getCasosUsoIteracion = (request, response) =>{
    let idIteracion = request.session.idIteracion;

    Casos_Uso.fetchAllIteracion(idIteracion) 
        .then(([rows, fieldData]) => {
            response.render('casosUso', {
                title: "Casos de Uso",
                casos_uso: rows 
            });
        })
        .catch(err => {
            console.log(err);
            response.redirect('/proyectos/casos-uso-iteracion');
        }); 
}

exports.getTareaCasoUso = (request, response) =>{
    response.render('tareaCasoUso', {
        title: "Tareas por Caso de Uso"
    });
}