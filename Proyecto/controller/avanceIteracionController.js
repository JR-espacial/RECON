const Proyecto = require('../models/proyecto');
const Iteracion = require('../models/iteracion');
const Capacidad_Equipo = require('../models/capacidad_equipo');



exports.getAvanceProyecto = (request, response) => {
    request.session.navegacion = 2;
    Iteracion.fetchOneID(request.session.idIteracion)
    .then(([rows, fieldData]) => {
        Capacidad_Equipo.fetchOne(rows[0].id_capacidad)
        .then(([rows2, fieldData]) => {
            let total_horas_real;
            let date1 = new Date(rows[0].fecha_inicio);
            let date2 = new Date(rows[0].fecha_fin);
            let diffTime = Math.abs(date2 - date1);
            let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 


            if(rows[0].total_min_real){
                total_horas_real= (rows[0].total_min_real/60).toFixed(2);
            }
            else{
                total_horas_real = "Sin registrar";
            }
            let velocidad_deseada = (total_horas_real/diffDays).toFixed(2);

            

            response.render('avanceProyecto', {
                navegacion : request.session.navegacion,
                proyecto_actual : request.session.nombreProyecto,
                user: request.session.usuario,
                iteracion: rows[0],
                capacidad: rows2[0],
                dias_totales: diffDays,
                horas_planeadas: total_horas_real,
                velocidad_deseada: velocidad_deseada,
                title: "Avance del Proyecto",
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