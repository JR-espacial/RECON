const { request, response } = require('express');
const Proyecto = require('../models/proyecto');
const Departamento = require('../models/departamento');
const Usuario = require('../models/user');

exports.getHome = (request, response) => {
    let alerta = request.session.alerta
    request.session.alerta = "";
    request.session.last = '/home';
    request.session.navegacion = 0;

    Proyecto.fetchAll(request.session.usuario)
    .then(([rows, fieldData]) => {
        Departamento.fetchAll()
        .then(([rows2, fieldData]) => {
            response.render('home',{
                imagen_empleado: request.session.imagen_empleado,
                user: request.session.usuario,
                title: "Home", 
                proyectos : rows,
                departamentos : rows2,
                alerta : alerta,
                csrfToken: request.csrfToken(),
                proyecto_actual: request.session.nombreProyecto,
                navegacion : request.session.navegacion
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

exports.postProyectoID = (request, response) => {
    request.session.idProyecto = request.body.idProyecto;
    request.session.nombreProyecto = request.body.nombreProyecto;
    response.redirect("/proyectos/iteraciones-desarrollo-proyecto");
}

exports.postEditarProyecto = (request, response) => {
    const nombre_proyecto = request.body.nombre;
    const descripcion = request.body.descripcion;
    const id_departamento = request.body.departamento;
    const id_proyecto = request.body.id_proyecto;
    const imagen_previa = request.body.imagen_previa;

    const image = request.file;
    let image_file_name = '';

    if(!image) {
        image_file_name = imagen_previa;
    }
    else{
        image_file_name = image.filename;
    }

    Proyecto.fetchOneModificar(nombre_proyecto, id_proyecto)
        .then(([rows, fieldData]) => {
            if (rows.length < 1) {
                Proyecto.modificarProyecto(nombre_proyecto, descripcion, image_file_name, id_proyecto)
                .then(() => {
                    Proyecto.modificarProyectoDepto(id_departamento, id_proyecto)
                        .then(() => {
                            request.session.alerta = "Proyecto modificado exitosamente";
                            response.redirect('/home');
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
                request.session.alerta = "Error: ya existe un proyecto con este nombre";
                response.redirect('/home');
            }
        })
        .catch(err => {
            console.log(err);
        });
}

exports.postEliminarProyecto = (request, response) => {
    const id_proyecto = request.body.id_proyecto;
    Proyecto.eliminarProyecto(id_proyecto)
    .then(() => {
        request.session.alerta = "Proyecto eliminado exitosamente";
        response.redirect('/home');
    })
    .catch(err => {
        console.log(err);
    });
}