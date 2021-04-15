const db = require('../util/mySQL');

module.exports =  class Capacidad_Equipo{
    constructor(id_capacidad){
        this.id_capacidad = id_capacidad;
    }
    
    static fetchAll(){
        return db.execute('SELECT * FROM Capacidad_Equipo');
    }

    static fetchOne(id_capacidad){
        return db.execute('SELECT * FROM Capacidad_Equipo WHERE id_capacidad =?', [id_capacidad]);
    }
    
    static fetchSumCapacidad(id_iteracion){
        return db.execute('SELECT SUM(horas_semanales) as horas_total FROM empleado_iteracion WHERE id_iteracion =?', [id_iteracion]);
    }

    static fetchCapacidadEmpleados(id_iteracion) {
        return db.execute('SELECT E.usuario, EI.horas_semanales FROM empleado_iteracion EI INNER JOIN Empleado E ON EI.id_empleado = E.id_empleado WHERE id_iteracion =?', [id_iteracion]);
    }

    static fetchAllPorcentajes(id_iteracion){
        return db.execute('SELECT horas_productivas, tiempo_perdido_pc, errores_registro_pc, overhead_pc, productivas_pc, operativos_pc, humano_pc, cmmi_pc FROM capacidad_equipo CE INNER JOIN iteracion I on CE.id_capacidad = I.id_capacidad WHERE id_iteracion =?', [id_iteracion]);
    }
}