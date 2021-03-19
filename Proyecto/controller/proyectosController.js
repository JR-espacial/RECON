const Proyecto = require('../models/proyecto');
const Fase = require('../models/fase');


exports.getNuevaIteracion = (request, response) => {
    response.render('crearIteracion',{
        alerta : request.session.alerta,
        csrfToken: request.csrfToken(),
    });
}

exports.getNuevoProyecto = (request, response) => {
    let module_ = request.params.module;
    if(module_ == "-nueva-iteracion"){
        module_ = "nueva-iteracion";
    }
    response.render('crearProyecto',{
        error: request.session.error,
        module_ : module_,
        csrfToken: request.csrfToken(),
    });
}

exports.postNuevoProyecto = (request, response) => {
    let module_ = request.params.module;
    if(module_ == "-nueva-iteracion"){
        module_ = "nueva-iteracion";
    }

    request.session.error = "";
    const nombre_proyecto = request.body.nombre;
    const descripcion = request.body.descripcion;
    const departamento = request.body.departamento;

    if(!nombre_proyecto && !departamento){
        request.session.error = "El nombre y el departamento no han sido seleccionados.";
        response.redirect('/proyectos/nuevo-proyecto' + module_);
    }
    else if(!nombre_proyecto){
        request.session.error = "El nombre está vacío";
        response.redirect('/proyectos/nuevo-proyecto' + module_);
    }
    else if(!departamento){
        request.session.error = "No se ha seleccionado el departamento";
        response.redirect('/proyectos/nuevo-proyecto' + module_);
    }

    Proyecto.fetchOne(nombre_proyecto)
        .then(([rows, fieldData]) => {
            if (rows.length < 1) {
                let proyecto = new Proyecto(nombre_proyecto, descripcion, departamento);
                proyecto.saveProyecto();
                Proyecto.fetchOne(nombre_proyecto)
                    .then(([id_proyecto, fieldData]) =>{
                        Proyecto.saveProyectoDepto(departamento, id_proyecto[0].id_proyecto)
                            .then(() => {
                                request.session.alerta = "Proyecto creado exitosamente";
                                response.redirect('/proyectos/' + module_);
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
                response.redirect('/proyectos/nuevo-proyecto' + module_);
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
    Fase.fetchAll()
        .then(([rows, fieldData]) => {
            response.render('fasesProyecto', {
                lista_fases: rows
            });
        })
        .catch(err => {
            console.log(err);
        });
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