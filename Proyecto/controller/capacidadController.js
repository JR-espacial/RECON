const { request, response } = require('express');
const capacidad_equipo = require('../models/capacidad_equipo');

exports.getCapacidadEquipo = (request, response) =>{
    const id_iteracion = request.session.idIteracion;
    let alerta = request.session.alerta;
    let toast = request.session.toast;
    request.session.alerta = "";
    request.session.toast = "";
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
                                csrfToken: request.csrfToken(),
                                toast: toast
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

    if (horas > 40) {
        request.session.alerta = "El número de horas semanales excede el máximo.";
        response.redirect('capacidad-equipo');
    }
    else {
        capacidad_equipo.updateCapacidadEmpleado(id_iteracion, id_empleado, horas)
            .then(() => {
                request.session.toast = "Capacidad Modificada";
                response.redirect('capacidad-equipo');
            })
            .catch(err => {
                console.log(err);
            })
    }
}


exports.postModificarPorcentajeTiempoPerdido = (request, response) => {
    const id_iteracion = request.session.idIteracion;
    const id_capacidad = request.body.id_capacidad;
    let tiempo_perdido_pc = request.body.tiempo_perdido_pc;

    if(tiempo_perdido_pc > 100){
        request.session.alerta = "Ingresa un porcentaje menor a 100%";
        response.redirect('capacidad-equipo');
    }
    else{
        tiempo_perdido_pc = (tiempo_perdido_pc / 100).toFixed(2);
        capacidad_equipo.updateCapacidadTiempoPerdido(id_capacidad, tiempo_perdido_pc)
            .then((fieldData) => {
                if(fieldData[0].changedRows === 0){
                    request.session.alerta = "El porcentaje ingresado sobrepasa el máximo posible o es el mismo.";
                    response.redirect('capacidad-equipo');
                } 
                else {
                    capacidad_equipo.callsetHorasProductivas(id_capacidad, id_iteracion)
                    .then((fieldData)=> {
                        request.session.toast = "Porcentaje Modificado";
                        response.redirect('capacidad-equipo');
                    })
                    .catch(err => {
                        console.log(err);
                    })
                }
            })
            .catch(err => {
                console.log(err);
            })
        }
}


exports.postModificarPorcentajeErroresRegistro = (request, response) => {
    const id_iteracion = request.session.idIteracion;
    const id_capacidad = request.body.id_capacidad;
    let errores_registro_pc = request.body.errores_registro_pc;

    if(errores_registro_pc > 100){
        request.session.alerta = "Ingresa un porcentaje menor a 100%";
        response.redirect('capacidad-equipo');
    }
    else{
        errores_registro_pc = (errores_registro_pc / 100).toFixed(2);
        capacidad_equipo.updateCapacidadErroresRegistro(id_capacidad, errores_registro_pc)
            .then((fieldData) => {
                if(fieldData[0].changedRows === 0){
                    request.session.alerta = "El porcentaje ingresado sobrepasa el máximo posible o es el mismo.";
                    response.redirect('capacidad-equipo');
                } 
                else {
                    capacidad_equipo.callsetHorasProductivas(id_capacidad, id_iteracion)
                    .then((fieldData)=> {
                        request.session.toast = "Porcentaje Modificado";
                        response.redirect('capacidad-equipo');
                    })
                    .catch(err => {
                        console.log(err);
                    })
                }
            })
            .catch(err => {
                console.log(err);
            })
        }
}



exports.postModificarPorcentajeOverhead = (request, response) => {
    const id_iteracion = request.session.idIteracion;
    const id_capacidad = request.body.id_capacidad;
    let overhead_pc = request.body.overhead_pc;

    if(overhead_pc >= 100){
        request.session.alerta = "Ingresa un porcentaje menor a 100%";
        response.redirect('capacidad-equipo');
    }
    else{
        overhead_pc = (overhead_pc / 100).toFixed(2);
        capacidad_equipo.updateCapacidadOverhead(id_capacidad, overhead_pc)
            .then(() => {
                capacidad_equipo.callsetHorasProductivas(id_capacidad, id_iteracion)
                    .then(()=> {
                        request.session.toast = "Porcentaje Modificado";
                        response.redirect('capacidad-equipo');
                    })
                    .catch(err => {
                        console.log(err);
                    })
            })
            .catch(err => {
                console.log(err);
            })
        }
}


exports.postModificarPorcentajeProductivas = (request, response) => {
    const id_iteracion = request.session.idIteracion;
    const id_capacidad = request.body.id_capacidad;
    let productivas_pc = request.body.productivas_pc;

    if(productivas_pc > 100){
        request.session.alerta = "Ingresa un porcentaje menor a 100%";
        response.redirect('capacidad-equipo');
    }
    else{
        productivas_pc = (productivas_pc / 100).toFixed(2);
        capacidad_equipo.updateCapacidadProductivas(id_capacidad, productivas_pc)
            .then((fieldData) => {
                if(fieldData[0].changedRows === 0){
                    request.session.alerta = "El porcentaje ingresado sobrepasa el máximo posible o es el mismo.";
                    response.redirect('capacidad-equipo');
                } 
                else {
                    capacidad_equipo.callsetHorasProductivas(id_capacidad, id_iteracion)
                    .then((fieldData)=> {
                        request.session.toast = "Porcentaje Modificado";
                        response.redirect('capacidad-equipo');
                    })
                    .catch(err => {
                        console.log(err);
                    })
                }
            })
            .catch(err => {
                console.log(err);
            })
        }
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
            .then((fieldData) => {
                if(fieldData[0].changedRows === 0){
                    request.session.alerta = "El porcentaje ingresado sobrepasa el máximo posible o es el mismo.";
                }
                else {
                    request.session.toast = "Porcentaje Modificado";
                }
                response.redirect('capacidad-equipo');
            })
            .catch(err => {
                console.log(err);
            })
        }
}


exports.postModificarPorcentajeHumano = (request, response) => {
    const id_capacidad = request.body.id_capacidad;
    let humano_pc = request.body.humano_pc;

    if(humano_pc > 100){
        request.session.alerta = "Ingresa un porcentaje menor a 100%";
        response.redirect('capacidad-equipo');
    }
    else{
        humano_pc = (humano_pc / 100).toFixed(2);
        capacidad_equipo.updateCapacidadHumano(id_capacidad, humano_pc)
            .then((fieldData) => {
                if(fieldData[0].changedRows === 0){
                    request.session.alerta = "El porcentaje ingresado sobrepasa el máximo posible o es el mismo.";
                }
                else {
                    request.session.toast = "Porcentaje Modificado";
                }
                response.redirect('capacidad-equipo');
            })
            .catch(err => {
                console.log(err);
            })
        }
}


exports.postModificarPorcentajeCMMI = (request, response) => {
    const id_capacidad = request.body.id_capacidad;
    let cmmi_pc = request.body.cmmi_pc;

    if(cmmi_pc > 100){
        request.session.alerta = "Ingresa un porcentaje menor a 100%";
        response.redirect('capacidad-equipo');
    }
    else{
        cmmi_pc = (cmmi_pc / 100).toFixed(2);
        capacidad_equipo.updateCapacidadCMMI(id_capacidad, cmmi_pc)
            .then((fieldData) => {
                if(fieldData[0].changedRows === 0){
                    request.session.alerta = "El porcentaje ingresado sobrepasa el máximo posible o es el mismo.";
                }
                else {
                    request.session.toast = "Porcentaje Modificado";
                }
                response.redirect('capacidad-equipo');
            })
            .catch(err => {
                console.log(err);
            })
        }
}