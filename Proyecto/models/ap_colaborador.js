const db = require('../util/mySQL');

module.exports = class ap_colaborador{
    constructor(id_proyecto, id_fase, id_tarea, id_ap, id_empleado, minutos){
        this.id_proyecto = id_proyecto;
        this.id_fase = id_fase;
        this.id_tarea = id_tarea; 
        this.id_ap = id_ap;
        this.id_empleado = id_empleado; 
        this.minutos = minutos;
    }

    static Save(id_proyecto, id_fase, id_tarea, id_empleado) {
        return db.execute('INSERT INTO ap_colaborador (id_proyecto, id_fase, id_tarea, id_ap, id_empleado, minutos) VALUES (?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?);',
        [id_proyecto, id_fase, id_tarea, 1, id_empleado, 0], 
        [id_proyecto, id_fase, id_tarea, 2, id_empleado, 0],
        [id_proyecto, id_fase, id_tarea, 3, id_empleado, 0],
        [id_proyecto, id_fase, id_tarea, 4, id_empleado, 0],
        [id_proyecto, id_fase, id_tarea, 5, id_empleado, 0],
        [id_proyecto, id_fase, id_tarea, 6, id_empleado, 0]);
    }

    static SaveOne(id_proyecto, id_fase, id_tarea, id_ap, id_empleado, minutos) {
        return db.execute('INSERT INTO ap_colaborador (id_proyecto, id_fase, id_tarea, id_ap, id_empleado, minutos) VALUES (?, ?, ?, ?, ?, ?);',
        [id_proyecto, id_fase, id_tarea, id_ap, id_empleado, minutos]);
    }

    static fetchALL(id_proyecto){
        return db.execute('SELECT id_fase, id_tarea, id_ap, id_empleado, minutos FROM ap_colaborador WHERE id_proyecto = ? ORDER BY id_fase DESC;',
        [id_proyecto]);
    }

    static fetchValues(id_proyecto, id_empleado){
        return db.execute('SELECT APC.id_fase, F.nombre_fase, APC.id_tarea, T.nombre_tarea, APC.id_ap, AP.ap, minutos FROM ap_colaborador as APC, fase as F, tarea as T, puntos_agiles as AP where APC.id_proyecto=? AND id_empleado=? AND APC.id_fase = F.id_fase AND APC.id_tarea = T.id_tarea AND APC.id_ap = AP.id_ap ORDER BY APC.id_fase, APC.id_tarea, APC.id_ap;', 
        [id_proyecto, id_empleado]);
    }

    static deleteTarea(id_proyecto, id_fase, id_tarea){
        return db.execute('DELETE FROM ap_colaborador WHERE id_proyecto=? AND id_fase=? AND id_tarea=?;',
        [id_proyecto, id_fase, id_tarea]);
    }

    static actualizaTiempos(idProyecto, idEmpleado, idFase, idTarea, idAP, minutos){
        return db.execute('CALL actualiza_tiempos(?, ?, ?, ?, ?, ?);', [idProyecto, idEmpleado, idFase, idTarea, idAP, minutos]);
    }
}