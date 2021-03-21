const Fase = require('../models/fase');

exports.getFasesProyecto = (request, response) =>{
    Fase.fetchAll()
        .then(([rows, fieldData]) => {
            response.render('fasesProyecto', {
                title: "Fases del Proyecto",
                lista_fases: rows
            });
        })
        .catch(err => {
            console.log(err);
        });
}