const Proyecto = require('../models/proyecto');
const Iteracion = require('../models/iteracion');
const Usuario = require('../models/user');
const { fetchLastNumIter } = require('../models/iteracion');

exports.getIteracionesProyecto = async function(request,response){
    const idProyecto = request.session.idProyecto;
    const alerta = request.session.alerta;
    request.session.navegacion = 1;
    request.session.alerta = "";
    let iteraciones;
    iteracion_actual = await Iteracion.fetchOnefromProyect(idProyecto, request.session.usuario);
    
    if(request.url == '/iteraciones-proyecto-desarrollo'){
        iteraciones = iteracion_actual;
        
    }
    else if(request.url == '/iteraciones-proyecto-terminado') {
        if(iteracion_actual[0][0]){
            iteraciones = await Iteracion.fetchAllfromProyect(idProyecto, request.session.usuario, iteracion_actual[0][0].id_iteracion);
        }
    }
    if(iteraciones == undefined){
        iteraciones = [[]];
    }

    const empleados = Usuario.fetchAll()
    response.render('iteracionesProyecto', {
        navegacion : request.session.navegacion,
        proyecto_actual : request.session.nombreProyecto,
        user: request.session.usuario,
        title: "Iteraciones",
        iteraciones : iteraciones[0],
        empleados : empleados,
        alerta : alerta,
        csrfToken: request.csrfToken()
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
            user: request.session.usuario,
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

exports.postNuevaIteracion = async function (request, response){

    const id_proyecto = request.session.idProyecto;
    const descripcion = request.body.descripcion;
    const fecha_inicio = request.body.fecha_inicio;
    const fecha_fin = request.body.fecha_fin;
    const colaboradores = request.body.colaboradores;
    const colabs =[];
    let alerta = "La iteracion fue creada exitosamente. Sin embargo los usuarios:";


    let colaborador = "";
    for (let i = 0; i < colaboradores.length; i++) {
        if(colaboradores[i] != ",") {
            colaborador += colaboradores[i];
        }
        else{
            colabs.push(colaborador);
            colaborador = "";
        }
    }

    colabs.push(request.session.usuario);

    await Iteracion.saveCapacidad();
    const fetchLastCapacidad =  await Iteracion.fetchLastCapacidad();
    const fetchLastNumIter =  await Iteracion.fetchLastNumIter(id_proyecto);
    let iteracion = new Iteracion(id_proyecto, fetchLastCapacidad[0][0].id_capacidad, fetchLastNumIter[0][0].num_iteracion, descripcion, fecha_inicio, fecha_fin, 1);
    await iteracion.saveIteracion(); 
    const fetchOneIteracion = await Iteracion.fetchOne(id_proyecto,fetchLastNumIter[0][0].num_iteracion);
    for (let i = 0; i < colabs.length; i++) {
        const fetchOneUsuario =  await Usuario.fetchOne(colabs[i]);
        if(fetchOneUsuario[0][0]){
            await Iteracion.saveColaborador(fetchOneUsuario[0][0].id_empleado, fetchOneIteracion[0][0].id_iteracion);
        }
        else{
            alerta += " "+ colabs[i] + " ";
        }
    }
    
    if(alerta != "La iteracion fue creada exitosamente. Sin embargo los usuarios:"){
        alerta += "no existen y no fueron registrados en la iteracion";
        request.session.alerta = alerta;
    }
    else{
        request.session.alerta = "Nueva iteracion creada exitosamente"
    }

    response.redirect("/proyectos/iteraciones-proyecto-desarrollo");
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
        response.redirect("/proyectos/iteraciones-proyecto-desarrollo");
    })
    .catch(err =>{
        console.log(err);
    });
}

exports.postEliminarIteracion =  async function(request, response){
    await Iteracion.eliminarIteracion(request.body.id_iteracion);
    request.session.alerta = "Iteración eliminada exitosamente";
    response.redirect('/proyectos/iteraciones-proyecto-desarrollo');
}

exports.getCapacidadEquipo = (request, response) =>{
    response.render('capacidadEquipo', {
        navegacion : request.session.navegacion,
        proyecto_actual : request.session.nombreProyecto,
        user: request.session.usuario,
        title: "Capacidad de Equipo"
    });
}