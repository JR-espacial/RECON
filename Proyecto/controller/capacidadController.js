const { request, response } = require('express');
const capacidad_equipo = require('../models/capacidad_equipo');

exports.getCapacidadEquipo = (request, response) =>{
    const id_iteracion = request.session.idIteracion;
    let alerta = request.session.alerta;
    capacidad_equipo.fetchCapacidadEmpleados(id_iteracion)
        .then(([rows, fieldData]) => {
            capacidad_equipo.fetchSumCapacidad(id_iteracion)
                .then(([rows2, fieldData]) => {
                    capacidad_equipo.fetchAllPorcentajes(id_iteracion)
                        .then(([rows3, fieldData]) => {
                            response.render('capacidadEquipo', {
                                navegacion : request.session.navegacion,
                                proyecto_actual : request.session.nombreProyecto,
                                user: request.session.usuario,
                                colaboradores: rows,
                                horas_nominales_totales: rows2[0],
                                porcentajes: rows3[0],
                                alerta: alerta,
                                title: "Capacidad de Equipo",
                                csrfToken: request.csrfToken()
                            });
                        })
                        .catch(err => {
                            console.log(err);
                        })
                })
        })
        .catch(err => {
            console.log(err);
        })
}

exports.postModificarHorasColaborador = (request, response) => {
    const id_iteracion = request.session.idIteracion;
    const id_empleado = request.body.id_empleado;
    const horas = request.body.horas;

    capacidad_equipo.updateCapacidadEmpleado(id_iteracion, id_empleado, horas)
        .then(() => {
            response.redirect('capacidad-equipo');
        })
        .catch(err => {
            console.log(err);
        })
}


exports.postModificarPorcentajeOperativos = (request, response) => {
    const id_capacidad = request.body.id_capacidad;
    let operativos_pc = request.body.operativos_pc;

    if(operativos_pc > 100){
        request.session.alerta = "Ingresa un porcentaje menor a 100%";
        response.redirect('capacidad-equipo');
    }
    else{
        operativos_pc = (operativos_pc / 100).toFixed(2);
        capacidad_equipo.updateCapacidadOperativos(id_capacidad, operativos_pc)
            .then(() => {
                response.redirect('capacidad-equipo');
            })
            .catch(err => {
                console.log(err);
            })
        }
}