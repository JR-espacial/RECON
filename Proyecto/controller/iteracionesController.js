const Proyecto = require('../models/proyecto');
const Iteracion = require('../models/iteracion');
const Usuario = require('../models/user');
const Empleado_Iteracion = require('../models/empleado_iteracion');
const CapacidadEquipo = require('../models/capacidad_equipo');
const PFT = require('../models/Proyecto_Fase_Tarea');
const APC = require('../models/ap_colaborador');
const APP = require('../models/ap_promedios');
const { fetchLastNumIter } = require('../models/iteracion');
const { fetchOne } = require('../models/proyecto');

exports.getIteracionesDesarrolloProyecto = async function(request,response){
    const idProyecto = request.session.idProyecto;
    const alerta = request.session.alerta;
    const toast = request.session.toast;
    request.session.alerta = "";
    request.session.toast = "";
    let iteraciones = await Iteracion.fetchIteracionesDesarrollo(idProyecto, request.session.usuario);
    let proyecto_keys = await Proyecto.fetchAirTableKeys(idProyecto);
    
    if(iteraciones == undefined){
        iteraciones = [[]];
    }
    const empleados = await Usuario.fetchAll();
    response.render('iteracionesProyecto', {
        navegacion : request.session.navegacion,
        proyecto_actual : request.session.nombreProyecto,
        imagen_empleado: request.session.imagen_empleado,
        imagen_proyecto:request.session.imagenProyecto,
        user: request.session.usuario,
        title: "Iteraciones",
        iteraciones : iteraciones[0],
        empleados : empleados[0],
        proyecto_keys : proyecto_keys[0][0],
        alerta : alerta,
        toast: toast,
        csrfToken: request.csrfToken()
    });
}

exports.getIteracionesTerminadasProyecto = async function(request,response){
    const idProyecto = request.session.idProyecto;
    const alerta = request.session.alerta;
    const toast = request.session.toast;
    request.session.navegacion = 1;
    request.session.alerta = "";
    request.session.toast = "";
    let iteraciones = await Iteracion.fetchIteracionesTerminadas(idProyecto, request.session.usuario);
    let proyecto_keys = await Proyecto.fetchAirTableKeys(idProyecto);

    if(iteraciones == undefined){
        iteraciones = [[]];
    }

    const empleados = await Usuario.fetchAll();
    response.render('iteracionesProyecto', {
        navegacion : request.session.navegacion,
        proyecto_actual : request.session.nombreProyecto,
        imagen_empleado: request.session.imagen_empleado,
        imagen_proyecto:request.session.imagenProyecto,
        user: request.session.usuario,
        title: "Iteraciones",
        iteraciones : iteraciones[0],
        empleados : empleados[0],
        proyecto_keys : proyecto_keys[0][0],
        alerta : alerta,
        toast: toast,
        csrfToken: request.csrfToken()
    });
}

exports.postIteracionesProyecto = (request, response) => {
    request.session.idIteracion = request.body.idIteracion;
    request.session.numIteracion = request.body.numIteracion;
    response.redirect('/proyectos/avance-proyecto');
}

exports.postChipsIteracionesProyecto = (request,response) =>{
    const id_iteracion = request.body.id_iteracion;
    Iteracion.fetchUsersfromIter(id_iteracion)
        .then(([rows, fieldData]) => {
            response.status(200).json(rows);
        })
        .catch(err => {
            console.log(err);
        });
}

exports.getNuevaIteracion = (request, response) => {
    const alerta = request.session.alerta;
    const toast = request.session.toast;
    request.session.alerta = "";
    request.session.toast = "";
    request.session.last = '/proyectos/nueva-iteracion';

    Usuario.fetchAll()
    .then(([rows, fieldData]) => {
        response.render('crearIteracion', {
            imagen_empleado: request.session.imagen_empleado,
            user: request.session.usuario,
            title: "Crear Iteración",
            empleados: rows,
            alerta : alerta,
            toast: toast,
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
    let tareas = [];
    let alerta = "La iteracion fue creada exitosamente. Sin embargo los usuarios:";

    if(fecha_fin < fecha_inicio){
        request.session.alerta = "La iteración no fue creada porque la fecha final debe de ser posterior a la de inicio";
        response.redirect("/proyectos/nueva-iteracion");
    }

    else{
        colabs.push(request.session.usuario);
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
        
        try {
            await CapacidadEquipo.saveCapacidadDefault();
        }catch(e){
            console.log(e);
        }
        
        const fetchLastCapacidad =  await Iteracion.fetchLastCapacidad();
        const fetchLastNumIter =  await Iteracion.fetchLastNumIter(id_proyecto);
        let iteracion = new Iteracion(id_proyecto, fetchLastCapacidad[0][0].id_capacidad, fetchLastNumIter[0][0].num_iteracion, descripcion, fecha_inicio, fecha_fin, 1);
        await iteracion.saveIteracion(); 
        const infoIteracion = await Iteracion.fetchOne(id_proyecto,fetchLastNumIter[0][0].num_iteracion);

        // Obtener tareas del proyecto
        tareas = await PFT.fetchTareasFasesId(request.session.idProyecto);

        // Relacionar usuarios con iteracion (todos incluyendo al que la crea)
        for (let i = 0; i < colabs.length; i++) {
            const infoUsuario =  await Usuario.fetchOne(colabs[i]);
            if(i == 0 || infoUsuario[0][0] && infoUsuario[0][0].usuario != request.session.usuario){
                const numIteracionesEmpleado = await Empleado_Iteracion.fetchIterPorEmpleado(infoUsuario[0][0].id_empleado, request.session.idProyecto);
                await Iteracion.saveColaborador(infoUsuario[0][0].id_empleado, infoIteracion[0][0].id_iteracion);
                
                // Primera aparicion en proyecto
                if(numIteracionesEmpleado[0][0].numIt < 1) {
                    // Agregar 6 campos en Ap_Colaborador (1 por AP) para cada tarea del proyecto y actualizar los promedios
                    for(let j=0; j < tareas[0].length; j++) {
                        for(let k=1; k<=6; k++) {
                            await APC.SaveOne(request.session.idProyecto, tareas[0][j].id_fase, tareas[0][j].id_tarea, k, infoUsuario[0][0].id_empleado, 0);
                            await APC.actualizaTiempos(request.session.idProyecto, infoUsuario[0][0].id_empleado, tareas[0][j].id_fase, tareas[0][j].id_tarea, k, 0);
                        }
                    }
                }
            }   
            else if(!infoUsuario[0][0] || infoUsuario[0][0].usuario != request.session.usuario){
                alerta += " "+ colabs[i] + " ";
            }
        }
        
        if(alerta != "La iteracion fue creada exitosamente. Sin embargo los usuarios:"){
            alerta += "no existen y no fueron registrados en la iteracion";
            request.session.alerta = alerta;
        }
        else{
            request.session.toast = "Iteracion creada."
        }

        response.redirect("/proyectos/iteraciones-desarrollo-proyecto");
    }
}

exports.postEditarIteracion = async function (request, response){
    const id_iteracion = request.body.id_iteracion;
    const descripcion = request.body.descripcion;
    const fecha_inicio = request.body.fecha_inicio;
    const fecha_fin = request.body.fecha_fin;
    const colaboradores = request.body.colaboradores;
    const colaboradoresBorrados = request.body.colaboradoresBorrados;
    const colabs =[];
    const colabsDeleted =[];
    let tareas = [];
    let alerta = "La iteracion fue modificada exitosamente. Sin embargo los usuarios:";

    if(fecha_fin < fecha_inicio){
        request.session.alerta = "La iteración no fue modificada porque la fecha final debe de ser posterior a la de inicio";
        response.redirect("/proyectos/iteraciones-desarrollo-proyecto");
    }
    else{
        let colaborador = "";
        for (let i = 0; i < colaboradores.length; i++) {
            if(colaboradores[i] != "," ) {
                colaborador += colaboradores[i];
            }
            else{
                colabs.push(colaborador);
                colaborador = "";
            }
            if(i == colaboradores.length-1){
                colabs.push(colaborador);
            }
        }
        colaborador = "";
        for (let i = 0; i < colaboradoresBorrados.length; i++) {
            if(colaboradoresBorrados[i] != ",") {
                colaborador += colaboradoresBorrados[i];
            }
            else{
                colabsDeleted.push(colaborador);
                colaborador = "";
            }
            if(i == colaboradoresBorrados.length-1){
                colabsDeleted.push(colaborador);
            }
        }

        await Iteracion.modificarIteracion(descripcion, fecha_inicio, fecha_fin, id_iteracion);

        // Obtener tareas del proyecto
        tareas = await PFT.fetchTareasFasesId(request.session.idProyecto);

        //Añadir colaboradores Empleado_iteracion (solo los nuevos)
        for (let i = 0; i < colabs.length; i++) {
            const fetchOneUsuario =  await Usuario.fetchOne(colabs[i]);
            if(fetchOneUsuario[0][0]){
                const numIteracionesEmpleado = await Empleado_Iteracion.fetchIterPorEmpleado(fetchOneUsuario[0][0].id_empleado, request.session.idProyecto);
                await Iteracion.saveColaborador(fetchOneUsuario[0][0].id_empleado, id_iteracion);
                
                // Primera aparicion en proyecto
                if(numIteracionesEmpleado[0][0].numIt < 1) {
                    // Agregar 6 campos en Ap_Colaborador (1 por AP) para cada tarea del proyecto y actualizar los promedios
                    for(let j=0; j < tareas[0].length; j++) {
                        for(let k=1; k<=6; k++) {
                            await APC.SaveOne(request.session.idProyecto, tareas[0][j].id_fase, tareas[0][j].id_tarea, k, fetchOneUsuario[0][0].id_empleado, 0);
                            await APC.actualizaTiempos(request.session.idProyecto, fetchOneUsuario[0][0].id_empleado, tareas[0][j].id_fase, tareas[0][j].id_tarea, k, 0);
                        }
                    }
                }
            }
            else{
                alerta += " "+ colabs[i] + " ";
            }
        }

        let eliminadosProyecto = 0;
        //Eliminar colaboradores Empleado_iteracion
        for (let i = 0; i < colabsDeleted.length; i++) {
            fetchOneUsuario =  await Usuario.fetchOne(colabsDeleted[i]);
            await Iteracion.removeUserfromIter(id_iteracion, colabsDeleted[i]);
            
            // Si ya no esta presente en el proyecto, borrar sus estimaciones y actualizar promedios            
            numIteracionesEmpleado = await Empleado_Iteracion.fetchIterPorEmpleado(fetchOneUsuario[0][0].id_empleado, request.session.idProyecto);
            if(numIteracionesEmpleado[0][0].numIt < 1) {
                await APC.deleteEstimacionesUsuario(request.session.idProyecto, fetchOneUsuario[0][0].id_empleado);
                eliminadosProyecto ++;
            }
        }

        //Actualizar promedios si se eliminaron empleados del proyecto
        if(eliminadosProyecto > 0) {
            for(let i=0; i<tareas[0].length; i++) {
                for(let j=1; j<=6; j++) {
                    await APP.updatePromedio(request.session.idProyecto, tareas[0][i].id_fase, tareas[0][i].id_tarea, j);
                }
            }
        }

        if(alerta != "La iteracion fue modificada exitosamente. Sin embargo los usuarios:"){
            alerta += "no existen y no fueron registrados en la iteracion";
            request.session.alerta = alerta;
        }
        else{
            request.session.toast = "Iteración modificada"
        }

        response.redirect("/proyectos/iteraciones-desarrollo-proyecto");
    }
}

exports.postEliminarIteracion =  async function(request, response){
    await Iteracion.eliminarIteracion(request.body.id_iteracion);
    request.session.toast = "Iteración eliminada";
    response.redirect('/proyectos/iteraciones-desarrollo-proyecto');
}

exports.postTerminarIteracion = async function(request, response){
    await Iteracion.terminarIteracion(request.session.idIteracion);
    request.session.toast = "Iteración terminada";
    response.redirect('/proyectos/iteraciones-desarrollo-proyecto');
}

exports.postAirTableKeys = async function (request, response){
    const Airtable = require('airtable');

    const base = new Airtable({apiKey: request.body.API_key}).base( request.body.base);

    base('Tasks').select({
        maxRecords: 1,
        view: "Global view"
    }).eachPage(function page(records, fetchNextPage) {
        records.forEach(function(record) {
        });
    
        fetchNextPage();
    
    },  async function done(err) {
        if (err) { 
            request.session.alerta = "La base o Apikey de AirTable no son correctas, por lo tanto no se registró la nueva configuración";
            response.redirect('/proyectos/iteraciones-desarrollo-proyecto');
            return; 
        }

        await Proyecto.saveAirTableKeys(request.body.base, request.body.API_key, request.session.idProyecto);
        request.session.toast = "AirTable modificado";
        response.redirect('/proyectos/iteraciones-desarrollo-proyecto');
    });
}

exports.getMiprogreso = async function(request,response){
    let alerta = "";
    let toast = "";
    let Airtable = require('airtable');
    let idProyecto = request.session.idProyecto;
    let proyecto_keys = await Proyecto.fetchAirTableKeys(idProyecto);
    let user = await Usuario.fetchOne(request.session.usuario);

    let misTareasCompletadas = 0;
    let tareasTotales=0;
    let asignados;

    let horasDia=[];
    let i =0;


    if(!proyecto_keys[0][0].base || !proyecto_keys[0][0].API_key){
       toast="Define una base de AirTable para ver más datos";

       response.render('miProgreso',{
        horasDia:horasDia,
        proyecto_keys : proyecto_keys[0][0],
        tareasTotales:tareasTotales,
        misTareasCompletadas: misTareasCompletadas,
        proyecto_actual : request.session.nombreProyecto,
        imagen_empleado: request.session.imagen_empleado,
        user: request.session.usuario,
        title: "Mi progreso", 
        alerta : alerta,
        toast: toast,  
        csrfToken: request.csrfToken(),
        proyecto_actual: request.session.nombreProyecto
    });
    }
    else{
        let base = new Airtable({apiKey: proyecto_keys[0][0].API_key}).base( proyecto_keys[0][0].base);
        
        base('Tasks').select({
            
            view: "Global view",
            sort :[{field: "Finished Date", direction: "asc"}],
            
            
        }).eachPage(function page(records, fetchNextPage) {
            records.forEach(function(record) {
                if(record.get('Status') == 'Done' && record.get('Assigned')){
                    asignados= record.get('Assigned');
                    asignados.forEach(element => {
                        if(element.email && element.email == user[0][0].correo){
                            misTareasCompletadas++;
                        }   
                    });
                }
                else{
                    tareasTotales++;
                } 
                if(record.get('Duration') && record.get('Assigned')) {
                    asignados= record.get('Assigned');
                    asignados.forEach(element => {
                        if(element.email && element.email == user[0][0].correo){
                            if( i>0 && record.get('Finished Date') && horasDia[i-1].fecha == record.get('Finished Date')){
                                horasDia[i-1].horas +=parseFloat((record.get('Duration')/3600).toFixed(5));
                            }
                            else if(record.get('Finished Date')){
                                horasDia[i] = {};
                                horasDia[i].fecha = record.get('Finished Date');
                                horasDia[i].horas = parseFloat((record.get('Duration')/3600).toFixed(5));
                                i++
                            }
                        }   
                    });
                    
                } 
                
            });
        
            fetchNextPage();
        
        },  async function done(err) {
            if (err) {
                console.log(err);
                response.render('miProgreso',{
                    horasDia:horasDia,
                    proyecto_keys : proyecto_keys[0][0],
                    tareasTotales:tareasTotales,
                    misTareasCompletadas: misTareasCompletadas,
                    proyecto_actual : request.session.nombreProyecto,
                    imagen_empleado: request.session.imagen_empleado,
                    user: request.session.usuario,
                    title: "Mi progreso", 
                    alerta : err,
                    toast: toast,  
                    csrfToken: request.csrfToken(),
                    proyecto_actual: request.session.nombreProyecto
                });
            }
            else{
                if(horasDia.length>14){
                    let aux =[];
                    for (let i = horasDia.length -15; i < horasDia.length; i++) {
                        aux.push(horasDia[i]);
                    }
                    horasDia=aux;
                }
                response.render('miProgreso',{
                    horasDia:horasDia,
                    proyecto_keys : proyecto_keys[0][0],
                    tareasTotales:tareasTotales,
                    misTareasCompletadas: misTareasCompletadas,
                    proyecto_actual : request.session.nombreProyecto,
                    imagen_empleado: request.session.imagen_empleado,
                    user: request.session.usuario,
                    title: "Mi progreso", 
                    alerta : alerta,
                    toast: toast,  
                    csrfToken: request.csrfToken(),
                    proyecto_actual: request.session.nombreProyecto
                });

            }
        });
    }
}