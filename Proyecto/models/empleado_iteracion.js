const db = require('../util/mySQL');

module.exports = class empleado_iteracion{
    constructor(id_empleado, id_iteracion){
        this.id_empleado = id_empleado; 
        this.id_iteracion = id_iteracion;
    }

    static fetchEmpleadosProyecto(id_proyecto) {
        return db.execute('SELECT DISTINCT id_empleado FROM empleado_iteracion as EI, iteracion as I WHERE I.id_proyecto = ? AND EI.id_iteracion = I.id_iteracion',
        [id_proyecto]);
    }

    static fetchIterPorEmpleado (id_empleado, id_proyecto) {
        return db.execute ('SELECT COUNT(empleado_iteracion.id_iteracion) as numIt FROM empleado_iteracion, iteracion WHERE id_empleado=? AND empleado_iteracion.id_iteracion=iteracion.id_iteracion AND id_proyecto = ?', 
        [id_empleado, id_proyecto]);
    }
}