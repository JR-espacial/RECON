const db = require('../util/mySQL');

module.exports = class Proyecto_Fase_Tarea {
    constructor(id_proyecto, id_fase, id_trabajo) {
        this.id_proyecto = id_proyecto;
        this.id_fase = id_fase;
        this.id_trabajo = id_trabajo;

    }

    saveProyecto_Fase_Tarea() {
        return db.execute('INSERT INTO proyecto_fase_practica (id_proyecto, id_fase, id_trabajo) VALUES (?, ?, ?)',
            [this.id_proyecto, this.id_fase, this.id_trabajo]);
    }

    static fetchFasesProyecto(id_proyecto) {
        return db.execute('SELECT id_fase FROM proyecto_fase_practica WHERE id_proyecto =?', [id_proyecto]);
    }

    static fetchAllTareasFaseProyecto(id_proyecto) {
        return db.execute('SELECT PFP.id_fase, nombre_fase, PFP.id_trabajo, nombre_practica_trabajo FROM proyecto_fase_practica PFP INNER JOIN practica_trabajo PT ON PFP.id_trabajo = PT.id_trabajo INNER JOIN Fase F ON F.id_fase = PFP.id_fase WHERE id_proyecto =? ORDER BY PFP.id_fase, PFP.id_trabajo', [id_proyecto]);
    }

    static fetchFaseInProyecto(id_proyecto, id_fase) {
        return db.execute('SELECT id_fase FROM proyecto_fase_practica WHERE id_proyecto =? AND id_fase =?', [id_proyecto, id_fase]);
    }

    static updateFaseInProyecto(id_proyecto, id_fase_anterior, id_fase_nuevo) {
        return db.execute('UPDATE proyecto_fase_practica SET id_fase =? WHERE id_proyecto =? AND id_fase =?', [id_fase_nuevo, id_proyecto, id_fase_anterior]);
    }

    static deleteFaseFromProject(id_proyecto, id_fase){
        return db.execute('DELETE FROM proyecto_fase_practica WHERE id_proyecto =? AND id_fase =?', [id_proyecto, id_fase]);
    }

    static fetchTareaInFase(id_proyecto, id_fase, id_tarea) {
        return db.execute('SELECT id_trabajo FROM proyecto_fase_practica WHERE id_proyecto =? AND id_fase =? AND id_trabajo =?', [id_proyecto, id_fase, id_tarea]);
    }

    static updateTareaInFase (id_proyecto, id_fase, id_tarea_anterior, id_tarea_nueva) {
        return db.execute('UPDATE proyecto_fase_practica SET id_trabajo =? WHERE id_proyecto =? AND id_fase =? AND id_trabajo =?', [id_tarea_nueva, id_proyecto, id_fase, id_tarea_anterior]);
    }

    static deleteTareaFromFase(id_proyecto, id_fase, id_tarea) {
        return db.execute('DELETE FROM proyecto_fase_practica WHERE id_proyecto =? AND id_fase =? AND id_trabajo =?', [id_proyecto, id_fase, id_tarea]);
    }
}