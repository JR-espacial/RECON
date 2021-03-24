const Proyecto_Fase_Tarea = require('../models/Proyecto_Fase_Tarea');
const Fase = require('../models/fase');
const Tarea = require('../models/tarea');

exports.getFasesProyecto = (request, response) =>{
    const id_proyecto = request.session.idProyecto;

    Proyecto_Fase_Tarea.fetchAllTareasFaseProyecto(id_proyecto)
        .then(([rows, fieldData]) => {
            response.render('fasesProyecto', {
                title: "Fases del Proyecto",
                lista_tareas: rows
            });
        })
        .catch(err => {
            console.log(err);
        });                            
}
