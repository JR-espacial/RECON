const db = require('../util/mySQL');

module.exports =  class Proyecto_Fase_Tarea{
    constructor(id_proyecto, id_fase, id_trabajo){
        this.id_proyecto = id_proyecto;
        this.id_fase = id_fase;
        this.id_trabajo = id_trabajo;

    }

    saveProyecto_Fase_Tarea(){ 
        return db.execute('INSERT INTO proyecto_fase_practica (id_proyecto, id_fase, id_trabajo) VALUES (?, ?, ?)',
        [this.id_proyecto, this.id_fase, this.id_trabajo]);
    }

    static fetchFasesProyecto(id_proyecto){ 
        return db.execute('SELECT id_fase FROM proyecto_fase_practica WHERE id_proyecto =?',[id_proyecto]);
    }

    static fetchAllTareasFaseProyecto(id_proyecto){
        return db.execute('SELECT nombre_fase, nombre_practica_trabajo FROM proyecto_fase_practica PFP INNER JOIN practica_trabajo PT ON PFP.id_trabajo = PT.id_trabajo INNER JOIN Fase F ON F.id_fase = PFP.id_fase WHERE id_proyecto =? ORDER BY PFP.id_fase, PFP.id_trabajo', [id_proyecto]);
    }

}