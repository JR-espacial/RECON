const { request, response } = require('express');
const Proyecto = require('../models/proyecto');
const Departamento = require('../models/departamento');
const Usuario = require('../models/user');

exports.getHome = async function (request, response){
    let alerta = request.session.alerta;
    let toast = request.session.toast;
    request.session.alerta = "";
    request.session.toast = "";
    request.session.last = '/home';
    request.session.navegacion = 0;

    let proyectos = await Proyecto.fetchAll(request.session.usuario);
    let departamentos = await Departamento.fetchAll();
    let user = await Usuario.fetchOne(request.session.usuario);
    let users = await Usuario.fetchAll();
    response.render('home',{
        imagen_empleado: request.session.imagen_empleado,
        title: "Home", 
        proyectos : proyectos[0],
        departamentos : departamentos[0],
        user : user[0][0],
        users : users[0],
        alerta : alerta,
        toast : toast,
        csrfToken: request.csrfToken(),
        proyecto_actual: request.session.nombreProyecto,
        navegacion : request.session.navegacion
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

exports.getManualUsuario = async function (request, response){
    let user = await Usuario.fetchOne(request.session.usuario);
    let users = await Usuario.fetchAll();
    response.render('ManualUsuario' ,{
        imagen_empleado: request.session.imagen_empleado,
        navegacion : request.session.navegacion,
        user : user[0][0],
        users : users[0],
        csrfToken: request.csrfToken(),
        title: 'Manual Usuario'
    }) 
}

exports.getAccesDenied = async function (request, response){
    let user = await Usuario.fetchOne(request.session.usuario);
    let users = await Usuario.fetchAll();
    response.render('AccesDenied' ,{
        imagen_empleado: request.session.imagen_empleado,
        navegacion : request.session.navegacion,
        user : user[0][0],
        users : users[0],
        csrfToken: request.csrfToken(),
        title: 'Acces Denied'
    }) 
}