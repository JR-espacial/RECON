const db = require('../util/mySQL');

module.exports =  class Iteracion{
    constructor(id_proyecto, descripcion){
        this.id_proyecto = id_proyecto;
        this.descripcion = descripcion;
    }

    saveIteracion(){ 
        return db.execute('INSERT INTO Iteracion (id_proyecto, id_capacidad, num_iteracion, descripcion, fecha_inicio, fecha_fin, estado_iteracion, total_min_real, total_min_maximo) VALUES (?, 2, 3, ?, CURRENT_DATE(), NULL, NULL, NULL, NULL)',
        [this.id_proyecto, this.descripcion]);
    }

    static saveCapacidad(){
        return db.execute('INSERT INTO Capacidad_equipo (horas_nominales_totales, horas_nominales_sin_ovh, horas_nominales_restantes, horas_productivas, tiempo_perdido_pc, errores_registro_pc, overhead_pc, productivas_pc, operativos_pc, humano_pc, cmmi_pc) VALUES (NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)')
    }

    static fetchAll() {
        return db.execute('SELECT * FROM Iteracion');
    }

    static fetchAllfromProyect(id_proyecto) {
        return db.execute('SELECT * FROM Iteracion WHERE id_proyecto =?',[id_proyecto]);
    }

    static fetchOne(num_iteracion) { 
        return db.execute('SELECT id_iteracion FROM Iteracion WHERE num_iteracion =?',[num_iteracion]);
    }
}