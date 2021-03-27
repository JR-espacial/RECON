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
    static crearEntrega(idCaso, idTarea) {
        return db.execute('INSERT into entrega (id_casos, id_trabajo) VALUES (?, ?)', 
        [idCaso, idTarea]);
    }

    static fetchAll() {
        return db.execute('SELECT * FROM Entrega');
    }
    
    static fetchTareaDeCaso(idCaso) {
        return db.execute('SELECT id_trabajo FROM entrega WHERE id_casos=?', 
        [idCaso]);
    }

    static dropEntrega(idCaso, idTarea) {
        return db.execute('DELETE FROM entrega WHERE id_casos=? AND id_trabajo=?', 
        [idCaso, idTarea]);
    }
}