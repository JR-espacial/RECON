const Proyecto = require('../models/proyecto');
const Fase = require('../models/fase');
const Casos_Uso = require('../models/casos_uso');
const Iteracion = require('../models/iteracion');
const Puntos_Agiles = require('../models/puntos_agiles');

const { response, request } = require('express');

exports.getIteracionesProyecto = (request,response) => {
    const idProyecto = request.session.idProyecto;
    const alerta = request.session.alerta;
    request.session.alerta = "";
    
    Iteracion.fetchAllfromProyect(idProyecto)
    .then(([rows, fieldData]) => {
        response.render('iteracionesProyecto', {
            title: "Iteraciones",
            iteraciones : rows,
            alerta : alerta,
            csrfToken: request.csrfToken()
        });
    })
    .catch(err => {
        console.log(err);
    });
}

exports.postIteracionesProyecto = (request, response) => {
    request.session.idIteracion = request.body.idIteracion;
    response.redirect('/proyectos/resumen-proyecto');
}

exports.getNuevaIteracion = (request, response) => {
    const alerta = request.session.alerta;
    request.session.alerta = "";
    request.session.last = '/proyectos/nueva-iteracion';

    Proyecto.fetchAll()
    .then(([rows, fieldData]) => {
        response.render('crearIteracion', {
            title: "Crear Iteración",
            proyectos : rows,
            alerta : alerta,
            csrfToken: request.csrfToken()
        });
    })
    .catch(err => {
        console.log(err);
    });

}

exports.postNuevaIteracion = (request, response) => {

    const last = request.session.last;
    const id_proyecto = request.body.proyecto;
    const descripcion = request.body.descripcion;

    Iteracion.saveCapacidad()
    .then(() => {
        Iteracion.fetchLastCapacidad()
        .then(([rows, fieldData]) => {
            Iteracion.fetchLastNumIter(id_proyecto)
            .then(([rows2, fieldData]) => {
                let iteracion = new Iteracion(id_proyecto, rows[0].id_capacidad, rows2[0].num_iteracion, descripcion);
                iteracion.saveIteracion()
                .then(() => {
                    response.redirect("/proyectos/iteraciones-proyecto");
                })
                .catch(err =>{
                    console.log(err);
                });
            })
            .catch(err =>{
                console.log(err);
            });
        })
        .catch(err =>{
            console.log(err);
        });
    })
    .catch(err =>{
        console.log(err);
    });

    
        
}

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

    if(!nombre_proyecto && !departamento){
        request.session.error = "El nombre y el departamento no han sido seleccionados.";
        response.redirect('/proyectos/nuevo-proyecto');
    }
    else if(!nombre_proyecto){
        request.session.error = "El nombre está vacío";
        response.redirect('/proyectos/nuevo-proyecto');
    }
    else if(!departamento){
        request.session.error = "No se ha seleccionado el departamento";
        response.redirect('/proyectos/nuevo-proyecto');
    }
    else{
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
}

exports.getResumenProyecto = (request, response) =>{
    response.render('resumenProyecto', {
        title: "Resumen del Proyecto"
    });
}

exports.getCasosUsoProyecto = (request, response) =>{
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
            response.redirect('/proyectos/casos-uso-proyecto');
        }); 
}

exports.getFasesProyecto = (request, response) =>{
    Fase.fetchAll()
        .then(([rows, fieldData]) => {
            response.render('fasesProyecto', {
                title: "Fases del Proyecto",
                lista_fases: rows
            });
        })
        .catch(err => {
            console.log(err);
        });
}

exports.getAvanceProyecto = (request, response) => {
    response.render('avanceProyecto', {
        title: "Avance del Proyecto"
    });
}

exports.getCapacidadEquipo = (request, response) =>{
    response.render('capacidadEquipo', {
        title: "Capacidad de Equipo"
    });
}

exports.getTareaCasoUso = (request, response) =>{
    response.render('tareaCasoUso', {
        title: "Tareas por Caso de Uso"
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