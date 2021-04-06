const db = require('../util/mySQL');

module.exports =  class Iteracion{
    constructor(id_proyecto, id_capacidad, num_iteracion, descripcion , fecha_inicio, fecha_fin, estado_iteracion){
        this.id_proyecto = id_proyecto;
        this.id_capacidad = id_capacidad;
        this.num_iteracion = num_iteracion;
        this.descripcion = descripcion;
        this.fecha_inicio = fecha_inicio;
        this.fecha_fin = fecha_fin;
        this.estado_iteracion = estado_iteracion;
    }

    saveIteracion(){ 
        return db.execute('INSERT INTO Iteracion (id_proyecto, id_capacidad, num_iteracion, descripcion, fecha_inicio, fecha_fin, estado_iteracion, total_min_real, total_min_maximo) VALUES (?, ?, ?, ?, ?, ?, ?, NULL, NULL)',
        [this.id_proyecto, this.id_capacidad, this.num_iteracion, this.descripcion, this.fecha_inicio, this.fecha_fin, this.estado_iteracion]);
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

    static fetchAllfromProyect(id_proyecto, usuario, iteracion_actual) {
        return db.execute('SELECT * FROM Iteracion I, Empleado_Iteracion EI, Empleado E WHERE I.id_proyecto =? AND I.estado_iteracion = 1 AND I.id_iteracion = EI.id_iteracion AND EI.id_empleado = E.id_empleado AND E.usuario =? AND NOT I.id_iteracion =?',[id_proyecto, usuario, iteracion_actual]);
    }

    static fetchOnefromProyect(id_proyecto, usuario) {
        return db.execute('SELECT * FROM Iteracion I WHERE I.id_proyecto =? AND num_iteracion = (SELECT MAX(I.num_iteracion) FROM Iteracion I, Empleado_Iteracion EI, Empleado E WHERE I.id_proyecto =? AND I.estado_iteracion = 1 AND I.id_iteracion = EI.id_iteracion AND EI.id_empleado = E.id_empleado AND E.usuario =?)',[id_proyecto, id_proyecto, usuario]);
    }

    static fetchAllColabs(id_iteracion){
        
    }

    static fetchOne(id_proyecto,num_iteracion) { 
        return db.execute('SELECT id_iteracion FROM Iteracion WHERE num_iteracion =? AND id_proyecto=?',[num_iteracion, id_proyecto]);
    }

    static modificarIteracion(id_proyecto, descripcion, fecha_inicio, fecha_fin, id_iteracion){
        return db.execute('UPDATE Iteracion SET descripcion =?, fecha_inicio =?, fecha_fin =? WHERE id_iteracion =?', [id_proyecto, descripcion, fecha_inicio, fecha_fin, id_iteracion]);
    }

    static eliminarIteracion(id_iteracion){
        return db.execute('UPDATE Iteracion SET estado_iteracion = 0 WHERE id_iteracion = ?', [id_iteracion]);
    }
    static saveColaborador(id_empleado,id_iteracion){
        return db.execute('INSERT INTO Empleado_Iteracion (id_empleado, id_iteracion, horas_semanales) VALUES (?, ?, NULL)', 
        [id_empleado, id_iteracion]);
    }
}