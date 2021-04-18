const db = require('../util/mySQL');

module.exports = class ap_promedios{
    constructor(id_proyecto, id_fase, id_tarea, id_ap, promedio_minutos){
        this.id_proyecto = id_proyecto;
        this.id_fase = id_fase;
        this.id_tarea = id_tarea; 
        this.id_ap = id_ap; 
        this.promedio_minutos = promedio_minutos;
    }

    static Save(id_proyecto, id_fase, id_tarea) {
        return db.execute('INSERT INTO ap_promedios (id_proyecto, id_fase, id_tarea, id_ap, promedio_minutos) VALUES(?, ?, ?, ?, ?), (?, ?, ?, ?, ?), (?, ?, ?, ?, ?), (?, ?, ?, ?, ?), (?, ?, ?, ?, ?), (?, ?, ?, ?, ?)', 
        [id_proyecto, id_fase, id_tarea, 1, 0], 
        [id_proyecto, id_fase, id_tarea, 2, 0], 
        [id_proyecto, id_fase, id_tarea, 3, 0], 
        [id_proyecto, id_fase, id_tarea, 4, 0], 
        [id_proyecto, id_fase, id_tarea, 5, 0], 
        [id_proyecto, id_fase, id_tarea, 6, 0]);
    }

    static fetchValues(id_proyecto){
        return db.execute('SELECT APP.id_fase, F.nombre_fase, APP.id_tarea, T.nombre_tarea, APP.id_ap, AP.ap, APP.promedio_minutos FROM ap_promedios as APP, fase as F, tarea as T, puntos_agiles as AP where APP.id_proyecto=? AND APP.id_fase = F.id_fase AND APP.id_tarea = T.id_tarea AND APP.id_ap = AP.id_ap ORDER BY APP.id_fase, APP.id_tarea, APP.id_ap', 
        [id_proyecto]);
    }
}