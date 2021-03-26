const { request, response } = require('express');
const Proyecto = require('../models/proyecto');
const Departamento = require('../models/departamento');

exports.getHome = (request, response) => {
    let alerta = request.session.alerta
    request.session.alerta = "";
    request.session.last = '/home';

    Proyecto.fetchAll()
    .then(([rows1, fieldData]) => {
        Departamento.fetchAll()
        .then(([rows2, fieldData]) => {
            response.render('home',{
                title: "Home", 
                proyectos : rows1,
                departamentos : rows2,
                alerta : alerta,
                csrfToken: request.csrfToken()
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
    response.redirect("/proyectos/iteraciones-proyecto");
}

exports.postEditarProyecto = (request, response) => {
    console.log("postEditarProyecto");
    const nombre_proyecto = request.body.nombre;
    const descripcion = request.body.descripcion;
    const id_departamento = request.body.departamento;
    const id_proyecto = request.body.id_proyecto;

    console.log(id_departamento);
  
    Proyecto.fetchOneModificar(nombre_proyecto, id_proyecto)
        .then(([rows, fieldData]) => {
            if (rows.length < 1) {
                Proyecto.modificarProyecto(nombre_proyecto, descripcion, id_proyecto)
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