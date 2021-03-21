const Casos_Uso = require('../models/casos_uso');

exports.getCasosUsoIteracion = (request, response) =>{
    let idIteracion = request.session.idIteracion;

    Casos_Uso.fetchAllIteracion(idIteracion) 
        .then(([rows, fieldData]) => {
            response.render('casosUso', {
                title: "Casos de Uso",
                casos_uso: rows,
                csrfToken: request.csrfToken()
            });
        })
        .catch(err => {
            console.log(err);
            response.redirect('/proyectos/casos-uso-iteracion');
        }); 
}

exports.postCasosUsoIteracion = (request, response) => {
    let accion = request.body.action;
    let idCaso = request.body.idCaso;
    console.log(idCaso);

    if(accion === "registrar") {
        console.log("Vas a registrar");
    }
    else if(accion === "editar") {
        console.log("Vas a editar?");
    }
    else if(accion === "eliminar") {
        Casos_Uso.DropEntreCaso(idCaso)
            .then(() => {
                console.log('Eliminada la entrega');
                Casos_Uso.DropCasoUso(idCaso)
                    .then(()=> {
                        console.log('Eliminado correctamente');
                        response.redirect('/proyectos/casos-uso-iteracion');  
                    })
                    .catch(err => {
                        console.log(err);
                        response.redirect('/proyectos/casos-uso-iteracion');
                    });
            })
            .catch( err => {
                console.log(err);
                response.redirect('/proyectos/casos-uso-iteracion');
            });
    }
    else {
        response.redirect('/proyectos/casos-uso-iteracion');
    }  
}

exports.getTareaCasoUso = (request, response) =>{
    response.render('tareaCasoUso', {
        title: "Tareas por Caso de Uso"
    });
}