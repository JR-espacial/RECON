const Proyecto = require('../models/proyecto');
const Iteracion = require('../models/iteracion');
const Capacidad_Equipo = require('../models/capacidad_equipo');

exports.getResumenProyecto = (request, response) =>{
    request.session.navegacion = 2;
    Iteracion.fetchOneID(request.session.idIteracion)
    .then(([rows, fieldData]) => {
        Capacidad_Equipo.fetchOne(rows[0].id_capacidad)
        .then(([rows2, fieldData]) => {
            let total_min_maximo;
            let total_horas_maximo;
            let horas_semanales;
            let total_semanas_maximo;
            let total_meses_maximo;

            if(rows[0].total_min_real){
                total_min_maximo = rows[0].total_min_maximo;
                total_horas_maximo = (rows[0].total_min_maximo/60).toFixed(2);
            }
            else{
                total_min_maximo = "Sin registrar";
                total_horas_maximo = "Sin registrar";
            }

            if(rows2[0].horas_productivas){
                horas_semanales = (rows2[0].horas_productivas);
                total_meses_maximo = (total_semanas_maximo/4.28).toFixed(2);
            }
            else{
                horas_semanales = "Sin registrar";
                total_meses_maximo = "Sin registrar";
            }

            if(rows[0].total_min_maximo && rows2[0].productivas_pc){
                total_semanas_maximo = (total_horas_maximo/horas_semanales).toFixed(2);
                total_meses_maximo = (total_semanas_maximo/4.28).toFixed(2);
            }
            else{
                total_semanas_maximo = "Sin registrar";
                total_meses_maximo = "Sin regresar";
            }

            response.render('resumenProyecto', {
                navegacion : request.session.navegacion,
                proyecto_actual : request.session.nombreProyecto,
                user: request.session.usuario,
                iteracion: rows[0],
                capacidad: rows2[0],
                total_min_maximo: total_min_maximo,
                total_horas_maximo: total_horas_maximo,
                horas_semanales: horas_semanales,
                total_semanas_maximo: total_semanas_maximo,
                total_meses_maximo: total_meses_maximo,
                title: "Resumen del Proyecto",
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