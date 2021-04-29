const Proyecto = require('../models/proyecto');
const Iteracion = require('../models/iteracion');
const Usuario = require('../models/user');
const CapacidadEquipo = require('../models/capacidad_equipo');
const { fetchLastNumIter } = require('../models/iteracion');

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

        for (let i = 0; i < colabs.length; i++) {
            const infoUsuario =  await Usuario.fetchOne(colabs[i]);
            if(i == 0 || infoUsuario[0][0] && infoUsuario[0][0].usuario != request.session.usuario){
                await Iteracion.saveColaborador(infoUsuario[0][0].id_empleado, infoIteracion[0][0].id_iteracion);
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

        //Añadir colaboradores Empleado_iteracion
        for (let i = 0; i < colabs.length; i++) {
            const fetchOneUsuario =  await Usuario.fetchOne(colabs[i]);
            if(fetchOneUsuario[0][0]){
                await Iteracion.saveColaborador(fetchOneUsuario[0][0].id_empleado, id_iteracion);
            }
            else{
                alerta += " "+ colabs[i] + " ";
            }
        }
        //Eliminar colaboradores Empleado_iteracion
        for (let i = 0; i < colabsDeleted.length; i++) {
            Iteracion.removeUserfromIter(id_iteracion,colabsDeleted[i]);
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
       alerta="Define una base de AirTable para ver más datos";

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
                console.log(record.get('Finished Date'));
                if(record.get('Status') == 'Done'){
                    asignados= record.get('Assigned');
                    asignados.forEach(element => {
                        if(element.email == user[0][0].correo){
                            misTareasCompletadas++;
                        }   
                    });
                }
                else{
                    tareasTotales++;
                } 
                if(record.get('Duration')) {
                    asignados= record.get('Assigned');
                    asignados.forEach(element => {
                        if(element.email == user[0][0].correo){
                            if( i>0 && horasDia[i-1].fecha == record.get('Finished Date')){
                                horasDia[i-1].horas +=parseFloat((record.get('Duration')/3600).toFixed(5));
                            }
                            else{
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
                console.error(err); 
            }
            else{
                if(horasDia.length>14){
                    let aux =[];
                    for (let i = horasDia.length -15; i < horasDia.length; i++) {
                        aux.push(horasDia[i]);
                    }
                    horasDia=aux;
                }
                console.log(horasDia);
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