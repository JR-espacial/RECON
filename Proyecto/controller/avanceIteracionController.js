const Proyecto = require('../models/proyecto');
const Iteracion = require('../models/iteracion');
const Capacidad_Equipo = require('../models/capacidad_equipo');
const Entrega = require('../models/entrega');



exports.getAvanceProyecto = async function (request, response) {
    request.session.navegacion = 2;
    let iteracion = await Iteracion.fetchOneID(request.session.idIteracion)
    let capacidad = await Capacidad_Equipo.fetchOne(iteracion[0][0].id_capacidad)
    
    let total_horas_real;
    let date1 = new Date(iteracion[0][0].fecha_inicio);
    let date2 = new Date(iteracion[0][0].fecha_fin);
    let diffTime = Math.abs(date2 - date1);
    let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

    if(iteracion[0][0].total_min_real){
        total_horas_real= (iteracion[0][0].total_min_real/60).toFixed(2);
    }
    else{
        total_horas_real = "Sin registrar";
    }
    let velocidad_deseada = (total_horas_real/diffDays).toFixed(2);

    let costos = await Entrega.fetchCostosDiarios(request.session.idIteracion);

    response.render('avanceProyecto', {
        navegacion : request.session.navegacion,
        proyecto_actual : request.session.nombreProyecto,
        user: request.session.usuario,
        iteracion: iteracion[0][0],
        capacidad: capacidad[0][0],
        dias_totales: diffDays,
        horas_planeadas: total_horas_real,
        velocidad_deseada: velocidad_deseada,
        costos: costos[0],
        title: "Avance del Proyecto",
        csrfToken: request.csrfToken()
    });

}