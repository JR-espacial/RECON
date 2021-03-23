const Proyecto = require('../models/proyecto');
const Puntos_Agiles = require('../models/puntos_agiles');


exports.getNuevoProyecto = (request, response) => {
    const error = request.session.error;
    request.session.error = "";
    const last = request.session.last;

    response.render('crearProyecto', {
        title: "Crear Proyecto", 
        error: error,
        last : last,
        csrfToken: request.csrfToken(),
    });
}

exports.postNuevoProyecto = (request, response) => {
    const last = request.session.last;

    const nombre_proyecto = request.body.nombre;
    const descripcion = request.body.descripcion;
    const departamento = request.body.departamento;
  
    Proyecto.fetchOne(nombre_proyecto)
        .then(([rows, fieldData]) => {
            if (rows.length < 1) {
                let proyecto = new Proyecto(nombre_proyecto, descripcion, departamento);
                proyecto.saveProyecto()
                .then(() => {
                    Proyecto.fetchOne(nombre_proyecto)
                    .then(([rows2, fieldData]) =>{
                        Proyecto.saveProyectoDepto(departamento, rows2[0].id_proyecto)
                            .then(() => {
                                request.session.alerta = "Proyecto creado exitosamente";
                                response.redirect(last);
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
            else {
                request.session.error = "Ya hay un proyecto con ese nombre";
                response.redirect('/proyectos/nuevo-proyecto');
            }
        })
        .catch(err => {
            console.log(err);
        });

}

exports.getResumenProyecto = (request, response) =>{
    response.render('resumenProyecto', {
        title: "Resumen del Proyecto"
    });
}


exports.getAvanceProyecto = (request, response) => {
    response.render('avanceProyecto', {
        title: "Avance del Proyecto"
    });
}

exports.getPromediosAP = (request, response) =>{
    response.render('promediosAP', {
        title: "Promedios AP"
    });
}

exports.getEstimadosAP = (request, response) =>{
    response.render('estimadosAP', {
        title: "Estimados AP"
    });
}