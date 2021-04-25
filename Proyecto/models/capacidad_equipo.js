const db = require('../util/mySQL');

module.exports =  class Capacidad_Equipo{
    constructor(id_capacidad){
        this.id_capacidad = id_capacidad;
    }

    static saveCapacidadDefault(){
        return db.execute('INSERT INTO capacidad_equipo (horas_productivas, tiempo_perdido_pc, errores_registro_pc, overhead_pc, productivas_pc, operativos_pc, humano_pc, cmmi_pc) VALUES (NULL, 0.15, NULL, NULL, 0.55, 0.25, 0.05, 0.15);')
    }
    
    static fetchAll(){
        return db.execute('SELECT * FROM capacidad_equipo;');
    }

    static fetchOne(id_capacidad){
        return db.execute('SELECT * FROM capacidad_equipo WHERE id_capacidad =?;', [id_capacidad]);
    }

    static fetchSumCapacidad(id_iteracion){
        return db.execute('SELECT SUM(horas_semanales) as horas_total FROM empleado_iteracion WHERE id_iteracion =?;', [id_iteracion]);
    }

    static fetchCapacidadEmpleados(id_iteracion) {
        return db.execute('SELECT EI.id_empleado, E.usuario, EI.horas_semanales FROM empleado_iteracion EI INNER JOIN empleado E ON EI.id_empleado = E.id_empleado WHERE id_iteracion =?;', [id_iteracion]);
    }

    static fetchAllPorcentajes(id_iteracion){
        return db.execute('SELECT CE.id_capacidad, horas_productivas, tiempo_perdido_pc, errores_registro_pc, overhead_pc, productivas_pc, operativos_pc, humano_pc, cmmi_pc, IFNULL(productivas_pc, 0) + IFNULL(operativos_pc, 0) + IFNULL(humano_pc, 0) + IFNULL(cmmi_pc, 0) as sumaRestantes FROM capacidad_equipo CE INNER JOIN iteracion I on CE.id_capacidad = I.id_capacidad WHERE id_iteracion =?;', [id_iteracion]);
    }

    static updateCapacidadEmpleado(id_iteracion, id_empleado, horas){
        return db.execute('UPDATE empleado_iteracion SET horas_semanales =? WHERE id_iteracion =? AND id_empleado =?;', [horas, id_iteracion, id_empleado]);
    }

    static updateCapacidadProductivas(id_capacidad, productivas_pc){
        return db.execute('UPDATE capacidad_equipo SET productivas_pc = IF(? + (IFNULL(operativos_pc, 0) + IFNULL(humano_pc, 0) + IFNULL(cmmi_pc, 0)) <= 1, ?, productivas_pc) WHERE id_capacidad =?;', [productivas_pc, productivas_pc, id_capacidad]);
    }

    static updateCapacidadTiempoPerdido(id_capacidad, tiempo_perdido_pc){
        return db.execute('UPDATE capacidad_equipo SET tiempo_perdido_pc = IF(? + IFNULL(errores_registro_pc, 0) < 1, ?, tiempo_perdido_pc) WHERE id_capacidad =?;', [tiempo_perdido_pc, tiempo_perdido_pc, id_capacidad]);
    }

    static updateCapacidadErroresRegistro(id_capacidad, errores_registro_pc){
        return db.execute('UPDATE capacidad_equipo SET errores_registro_pc = IF(? + IFNULL(tiempo_perdido_pc, 0) < 1, ?, errores_registro_pc) WHERE id_capacidad =?;', [errores_registro_pc, errores_registro_pc, id_capacidad]);
    }

    static updateCapacidadOverhead(id_capacidad, overhead_pc){
        return db.execute('UPDATE capacidad_equipo SET overhead_pc =? WHERE id_capacidad =?;', [overhead_pc, id_capacidad]);
    }

    static updateCapacidadOperativos(id_capacidad, operativos_pc){
        return db.execute('UPDATE capacidad_equipo SET operativos_pc = IF(? + (IFNULL(productivas_pc, 0) + IFNULL(humano_pc, 0) + IFNULL(cmmi_pc, 0)) <= 1, ?, operativos_pc) WHERE id_capacidad =?;', [operativos_pc, operativos_pc, id_capacidad]);
    }

    static updateCapacidadHumano(id_capacidad, humano_pc){
        return db.execute('UPDATE capacidad_equipo SET humano_pc = IF(? + (IFNULL(productivas_pc, 0) + IFNULL(operativos_pc, 0) + IFNULL(cmmi_pc, 0)) <= 1, ?, humano_pc) WHERE id_capacidad =?;', [humano_pc, humano_pc, id_capacidad]);
    }

    static updateCapacidadCMMI(id_capacidad, cmmi_pc){
        return db.execute('UPDATE capacidad_equipo SET cmmi_pc = IF(? + (IFNULL(productivas_pc, 0) + IFNULL(operativos_pc, 0) + IFNULL(humano_pc, 0)) <= 1, ?, cmmi_pc) WHERE id_capacidad =?;', [cmmi_pc, cmmi_pc, id_capacidad]);
    }

    static callsetHorasProductivas(id_capacidad, id_iteracion){
        return db.execute('CALL set_horas_productivas(?, ?);', [id_capacidad, id_iteracion]);
    }
}