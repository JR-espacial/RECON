const db = require('../util/mySQL');

module.exports = class ap_promedios{
    constructor(id_proyecto, id_fase, id_tarea, id_ap, id_empleado, minutos){
        this.id_proyecto = id_proyecto;
        this.id_fase = id_fase;
        this.id_tarea = id_tarea; 
        this.id_ap = id_ap; 
        this.minutos = minutos;
    }

    static fetchValues(id_proyecto){
        return db.execute('SELECT APC.id_fase, F.nombre_fase, APC.id_tarea, T.nombre_tarea, APC.id_ap, AP.ap, minutos FROM ap_colaborador as APC, fase as F, tarea as T, puntos_agiles as AP where APC.id_proyecto=? AND APC.id_fase = F.id_fase AND APC.id_tarea = T.id_tarea AND APC.id_ap = AP.id_ap ORDER BY APC.id_fase, APC.id_tarea, APC.id_ap', 
        [id_proyecto]);
    }
}