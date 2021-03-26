const Proyecto = require('../models/proyecto');
const Iteracion = require('../models/iteracion');
const Usuario = require('../models/user');

exports.getIteracionesProyecto = (request,response) => {
    const idProyecto = request.session.idProyecto;
    const alerta = request.session.alerta;
    request.session.alerta = "";
  
    Iteracion.fetchAllfromProyect(idProyecto)
    .then(([rows, fieldData]) => {
        Usuario.fetchAll()
        .then(([rows2, fieldData]) => {
            response.render('iteracionesProyecto', {
                title: "Iteraciones",
                iteraciones : rows,
                empleados : rows2,
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

exports.postIteracionesProyecto = (request, response) => {
    request.session.idIteracion = request.body.idIteracion;
    response.redirect('/proyectos/resumen-proyecto');
}

exports.getNuevaIteracion = (request, response) => {
    const alerta = request.session.alerta;
    request.session.alerta = "";
    request.session.last = '/proyectos/nueva-iteracion';

    Usuario.fetchAll()
    .then(([rows, fieldData]) => {
        response.render('crearIteracion', {
            title: "Crear Iteración",
            empleados: rows,
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
    const id_proyecto = request.session.idProyecto;
    const descripcion = request.body.descripcion;
    const colaborador = request.body.colaborador;

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

exports.postEditarIteracion = (request, response) =>{
    const last = request.session.last;
    const id_proyecto = request.session.idProyecto;
    const id_iteracion = request.body.id_iteracion;
    const descripcion = request.body.descripcion;
    const colaborador = request.body.colaborador;

    Iteracion.modificarIteracion(id_proyecto, descripcion, id_iteracion)
    .then(() => {
        request.session.alerta = "Iteración modificada exitosamente";
        response.redirect("/proyectos/iteraciones-proyecto");
    })
    .catch(err =>{
        console.log(err);
    });
}

exports.postEliminarIteracion = (request, response) => {
    const id_iteracion = request.body.id_iteracion;
    Iteracion.eliminarIteracion(id_iteracion)
    .then(() => {
        request.session.alerta = "Iteración eliminada exitosamente";
        response.redirect('/proyectos/iteraciones-proyecto');
    })
    .catch(err => {
        console.log(err);
    });
}

exports.getCapacidadEquipo = (request, response) =>{
    response.render('capacidadEquipo', {
        title: "Capacidad de Equipo"
    });
}