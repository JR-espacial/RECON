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
    let idIteracion = request.session.idIteracion;

    if(accion === "registrar") {
        let yo_como = request.body.yo_como;
        let quiero = request.body.quiero;
        let para = request.body.para;
        let id_ap = request.body.id_ap;
        let casoU = new Casos_Uso(id_ap, idIteracion, yo_como, quiero, para);
        casoU.saveCaso()
            .then(() => {
               console.log("Caso registrado correctamente"); 
            })
            .catch( err => {
                console.log(err);
            }); 
    }
    else if(accion === "editar") {
        console.log("Vas a editar?");
    }
    else if(accion === "eliminar") {
        Casos_Uso.DropEntreCaso(idCaso)
            .then(() => {
                console.log('Eliminada la entrega');
            })
            .catch( err => {
                console.log(err);
            });
        Casos_Uso.DropCasoUso(idCaso)
            .then(()=> {
                console.log('Eliminado correctamente'); 
            })
            .catch(err => {
                console.log(err);
            });
    }
    response.redirect('/proyectos/casos-uso-iteracion');
}

exports.getTareaCasoUso = (request, response) =>{
    response.render('tareaCasoUso', {
        title: "Tareas por Caso de Uso"
    });
}