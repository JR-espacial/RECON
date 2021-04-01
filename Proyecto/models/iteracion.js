const db = require('../util/mySQL');

module.exports =  class Iteracion{
    constructor(id_proyecto, id_capacidad, num_iteracion, descripcion , fecha_inicio, fecha_fin){
        this.id_proyecto = id_proyecto;
        this.id_capacidad = id_capacidad;
        this.num_iteracion = num_iteracion;
        this.descripcion = descripcion;
        this.fecha_inicio = fecha_inicio;
        this.fecha_fin = fecha_fin;
    }

    saveIteracion(){ 
        return db.execute('INSERT INTO Iteracion (id_proyecto, id_capacidad, num_iteracion, descripcion, fecha_inicio, fecha_fin, estado_iteracion, total_min_real, total_min_maximo) VALUES (?, ?, ?, ?, ?, ?, 1, NULL, NULL)',
        [this.id_proyecto, this.id_capacidad, this.num_iteracion, this.descripcion, this.fecha_inicio, this.fecha_fin]);
    }

    static saveCapacidad(){
        return db.execute('INSERT INTO Capacidad_equipo (horas_nominales_totales, horas_nominales_sin_ovh, horas_nominales_restantes, horas_productivas, tiempo_perdido_pc, errores_registro_pc, overhead_pc, productivas_pc, operativos_pc, humano_pc, cmmi_pc) VALUES (NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)')
    }

    static fetchLastNumIter(id_proyecto){
        return db.execute('SELECT MAX(I.num_iteracion)+1 AS num_iteracion FROM Iteracion I WHERE id_proyecto = ?',
        [id_proyecto]);
    }

    static fetchLastCapacidad(){
        return db.execute('SELECT MAX(id_capacidad) AS id_capacidad FROM Capacidad_equipo');
    }

    static fetchAll() {
        return db.execute('SELECT * FROM Iteracion WHERE estado_iteracion = 1');
    }

    static fetchAllfromProyect(id_proyecto) {
        return db.execute('SELECT * FROM Iteracion WHERE id_proyecto =? AND estado_iteracion = 1',[id_proyecto]);
    }

    static fetchOne(id_proyecto,num_iteracion) { 
        return db.execute('SELECT id_iteracion FROM Iteracion WHERE num_iteracion =? AND id_proyecto=?',[num_iteracion, id_proyecto]);
    }

    static modificarIteracion(id_proyecto, descripcion, id_iteracion){
        return db.execute('UPDATE Iteracion SET id_proyecto = ?, descripcion = ? WHERE id_iteracion = ?', [id_proyecto, descripcion, id_iteracion]);
    }

    static eliminarIteracion(id_iteracion){
        return db.execute('UPDATE Iteracion SET estado_iteracion = 0 WHERE id_iteracion = ?', [id_iteracion]);
    }
    static saveColaborador(id_iteracion,id_empleado){
        return db.execute('INSERT INTO Empleado_Iteracion (id_empleado, id_iteracion, horas_semanales) VALUES (?, ?, NULL)', 
        [id_empleado,id_iteracion]);
    }
}