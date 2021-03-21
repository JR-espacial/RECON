const Proyecto = require('../models/proyecto');
exports.getHome = (request, response) => {
    let alerta = request.session.alerta
    request.session.alerta = "";
    request.session.last = '/home';

    Proyecto.fetchAll()
    .then(([rows, fieldData]) => {
        response.render('home',{
            title: "Home", 
            proyectos : rows,
            alerta : alerta,
            csrfToken: request.csrfToken()
        });
    })
    .catch(err => {
        console.log(err);
    });
}

exports.postProyectoID = (request, response) => {
    request.session.idProyecto = request.body.idProyecto;
    response.redirect("/proyectos/iteraciones-proyecto");
}
