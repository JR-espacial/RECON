const { request, response } = require("express");


exports.getNuevoProyecto = (request, response) => {
    response.render('crearProyecto');
}

exports.getResumenProyecto = (request,response) =>{
    response.render('resumenProyecto')
}
exports.getCasosUsoProyecto = (request,response) =>{
    response.render('casosUso')
}