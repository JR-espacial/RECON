const Proyecto = require('../models/proyecto');


exports.getNuevaIteracion = (request, response) => {
    response.render('crearIteracion');
}

exports.getNuevoProyecto = (request, response) => {
    let module_ = request.params.module;
    if(module_ == "-nueva-iteracion"){
        module_ = "nueva-iteracion";
    }
    response.render('crearProyecto',{
        module_ : module_,
        csrfToken: request.csrfToken(),
    });
}

exports.postNuevoProyecto = (request, response) => {
    let module_ = request.params.module;
    if(module_ == "-nueva-iteracion"){
        module_ = "nueva-iteracion";
    }
    response.redirect(module_);

    request.session.error = "";
    const nombre_proyecto = request.body.nombre;
    const descripcion = request.body.descripcion;
    const departamento = request.body.departamento;
    Proyecto.fetchOne(nombre_proyecto)
        .then(([rows, fieldData]) => {
            if (rows.length < 1) {
                let proyecto = new Proyecto(nombre_proyecto, descripcion, departamento);
                proyecto.saveProyecto();
                Proyecto.fetchOne(nombre_proyecto)
                    .then(([id_proyecto, fieldData]) =>{
                        Proyecto.saveProyectoDepto(departamento, id_proyecto[0].id_proyecto)
                            .then(() => {
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

exports.getResumenProyecto = (request,response) =>{
    response.render('resumenProyecto')
}
exports.getCasosUsoProyecto = (request,response) =>{
    response.render('casosUso')
}

exports.getFasesProyecto = (request,response) =>{
    response.render('fasesProyecto')
}

exports.getAvanceProyecto = (request, response) => {
    response.render('avanceProyecto')
}

exports.getCapacidadEquipo = (request,response) =>{
    response.render('capacidadEquipo')
}

exports.getTareaCasoUso = (request,response) =>{
    response.render('tareaCasoUso')
}
exports.getPromediosAP = (request,response) =>{
    response.render('promediosAP')
}
exports.getEstimadosAP = (request,response) =>{
    response.render('estimadosAP')
}