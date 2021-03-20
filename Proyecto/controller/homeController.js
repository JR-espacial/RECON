const Proyecto = require('../models/proyecto');
exports.getHome = (request, response) => {
    const alerta= request.session.alerta
    request.session.alerta = ""
    request.session.last = '/home';

    Proyecto.fetchAll()
    .then(([rows, fieldData]) => {
        response.render('home',{
            title: "Home", 
            proyectos : rows,
            alerta : alerta
        });
    })
    .catch(err => {
        console.log(err);
    });
}