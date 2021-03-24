const db = require('../util/mySQL');


module.exports =  class Entrega {
    constructor(id_tarea, id_caso) {
        this.id_trabajo = id_tarea;
        this.id_caso = id_caso;
        this.estado_entrega = '0';
    }

    // saveIteracion(){ 
    //     return db.execute('INSERT INTO Iteracion (id_proyecto, id_capacidad, num_iteracion, descripcion, fecha_inicio, fecha_fin, estado_iteracion, total_min_real, total_min_maximo) VALUES (?, ?, ?, ?, CURRENT_DATE(), NULL, NULL, NULL, NULL)',
    //     [this.id_proyecto, this.id_capacidad, this.num_iteracion, this.descripcion]);
    // }

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