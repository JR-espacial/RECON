const capacidad_equipo = require('../models/capacidad_equipo');

exports.getCapacidadEquipo = (request, response) =>{
    const id_iteracion = request.session.idIteracion;
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