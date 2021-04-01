const Proyecto = require('../models/proyecto');
const Iteracion = require('../models/iteracion');
const Usuario = require('../models/user');
const Departamento = require('../models/departamento');
const Puntos_Agiles = require('../models/puntos_agiles');
const Proyecto_Fase_Tarea = require('../models/Proyecto_Fase_Tarea');
const { request } = require('express');

exports.getNuevoProyecto = (request, response) => {
    const error = request.session.error;
    request.session.error = "";
    const last = request.session.last;
    Departamento.fetchAll()
    .then(([rows, fieldData]) => {
        response.render('crearProyecto', {
            title: "Crear Proyecto", 
            departamentos : rows,
            error: error,
            last : last,
            csrfToken: request.csrfToken(),
        });
    })
}

exports.postNuevoProyecto = async function (request, response) {
    const last = request.session.last;

    const nombre_proyecto = request.body.nombre;
    const descripcion = request.body.descripcion;
    const departamento = request.body.departamento;

    const image = request.file;
    let image_file_name = '';

    if(!image) {
        console.error('Error al subir la imagen');
        image_file_name = 'https://www.esan.edu.pe/conexion/actualidad/2017/10/26/1500x844_portafolio_proyectos.jpg';
    }
    else{
        image_file_name = image.filename;
    }
  
    const proyecto_existente = await Proyecto.fetchOne(nombre_proyecto);
    if (proyecto_existente[0].length < 1) {
        let proyecto = new Proyecto(nombre_proyecto, descripcion, departamento, '1', image_file_name, 0);
        await proyecto.saveProyecto();
        const id_proyecto = await Proyecto.fetchOne(nombre_proyecto);
        await Proyecto.saveProyectoDepto(departamento, id_proyecto[0][0].id_proyecto);
        await Iteracion.saveCapacidad();
        const fetchLastCapacidad =  await Iteracion.fetchLastCapacidad();
        let iteracion = new Iteracion(id_proyecto[0][0].id_proyecto, fetchLastCapacidad[0][0].id_capacidad, 0, 'NULL', 'NULL', 'NULL', 0);
        await iteracion.saveIteracion();
        const fetchOneIteracion = await Iteracion.fetchOne(id_proyecto[0][0].id_proyecto, 0);
        const fetchOneUsuario =  await Usuario.fetchOne(request.session.usuario);
        await Iteracion.saveColaborador(fetchOneUsuario[0][0].id_empleado, fetchOneIteracion[0][0].id_iteracion);

        request.session.alerta = "Proyecto creado exitosamente";
        response.redirect(last);
    }
    else {
        request.session.error = "Ya hay un proyecto con ese nombre";
        response.redirect('/proyectos/nuevo-proyecto');
    }
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
    const id_proyecto = request.session.idProyecto;

    Proyecto_Fase_Tarea.fetchAllTareasFaseProyecto(id_proyecto)
        .then(([rows, fieldData]) => {
            response.render('estimadosAP', {
                title: "Estimados AP",
                lista_tareas: rows
            });
        })
        .catch(err => {
            console.log(err);
        });  
}