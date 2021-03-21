const db = require('../util/mySQL');

module.exports =  class Iteracion {
    constructor(nombre_iteracion, descripcion){
        this.nombre_iteracion = nombre_iteracion;
        this.descripcion = descripcion;
    }

    saveIteracion() { 
        return db.execute('INSERT INTO Iteracion (nombre_iteracion, descripcion, fecha_inicio, fecha_fin) VALUES (?, ?, CURRENT_DATE(),NULL)',
        [this.nombre_iteracion, this.descripcion]);
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