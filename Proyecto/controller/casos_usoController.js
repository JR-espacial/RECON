const Casos_Uso = require('../models/casos_uso');
const Proyecto_Fase_Tarea = require('../models/Proyecto_Fase_Tarea');

exports.getCasosUsoIteracion = (request, response) =>{
    let idIteracion = request.session.idIteracion;

    Casos_Uso.fetchAllIteracion(idIteracion) 
        .then(([rows, fieldData]) => {
            response.render('casosUso', {
                navegacion : request.session.navegacion,
                proyecto_actual : request.session.nombreProyecto,
                imagen_empleado: request.session.imagen_empleado,
                user: request.session.usuario,
                num_iteracion: request.session.numIteracion,
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

        if (!para) para = "";
        
        let casoU = new Casos_Uso(id_ap, idIteracion, yo_como, quiero, para);
        Casos_Uso.fetchAllIteracion(idIteracion) 
        .then(([rows, fieldData]) => {
                if(rows.length > 0){
                    casoU.saveCaso()
                    .then(() => {
                        response.redirect('/proyectos/casos-uso-iteracion');
                    })
                    .catch( err => {
                        console.log(err);
                    }); 
                }else{
                    casoU.savePrimerCaso()
                    .then(() => {
                        response.redirect('/proyectos/casos-uso-iteracion');
                    })
                    .catch( err => {
                        console.log(err);
                    }); 
                }
        })
        .catch(err => {
            console.log(err);
            response.redirect('/proyectos/casos-uso-iteracion');
        });
    }
    else if(accion === "editar") {
        let idCaso = request.body.idCaso;
        let idAp = request.body.id_ap;
        let yo_como = request.body.yo_como;
        let quiero = request.body.quiero;
        let para = request.body.para;
        let comentario = request.body.comentario;
        let idApPasado = request.body.id_ap_pasado;
                
        if (!idAp) idAp = idApPasado;
        if (!yo_como) yo_como = "";
        if (!quiero) quiero = "";
        if (!para) para = "";
        if (!comentario) comentario = "";
        
        Casos_Uso.ModifyCaso(idCaso, idAp, yo_como, quiero, para, comentario)
        .then(() =>{
            response.redirect('/proyectos/casos-uso-iteracion');
        })
        .catch(err => {
            console.log(err);
        });   
    }
    else if(accion === "eliminar") {
        Casos_Uso.DropEntreCaso(idCaso)
            .then(() => {
                Casos_Uso.DropCasoUso(idCaso)
                    .then(()=> {
                        response.redirect('/proyectos/casos-uso-iteracion');
                    })
                    .catch(err => {
                        console.log(err);
                    });
            })
            .catch( err => {
                console.log(err);
            });       
    }
    else {
        response.redirect('/proyectos/casos-uso-iteracion');
    }
}

