const db = require('../util/mySQL');


module.exports =  class Entrega {
    constructor(id_proyecto, id_fase, id_tarea, id_caso) {
        this.id_proyecto = id_proyecto;
        this.id_fase = id_fase;
        this.id_tarea = id_tarea;
        this.id_caso = id_caso;
        this.estado_entrega = '0';
    }

    // saveIteracion(){ 
    //     return db.execute('INSERT INTO Iteracion (id_proyecto, id_capacidad, num_iteracion, descripcion, fecha_inicio, fecha_fin, estado_iteracion, total_min_real, total_min_maximo) VALUES (?, ?, ?, ?, CURRENT_DATE(), NULL, NULL, NULL, NULL)',
    //     [this.id_proyecto, this.id_capacidad, this.num_iteracion, this.descripcion]);
    // }
    static crearEntrega(idProyecto, idFase, idTarea, idCaso) {
        return db.execute('INSERT INTO entrega (id_proyecto, id_fase, id_tarea, id_casos) VALUES (?, ?, ?, ?)', 
        [idProyecto, idFase, idTarea, idCaso]);
    }

    static fetchAll() {
        return db.execute('SELECT * FROM Entrega');
    }
    
    static fetchTareaDeCaso(idProyecto, idIteracion, idCaso) {
        return db.execute('SELECT id_fase, id_tarea FROM entrega, casos_uso WHERE id_iteracion=? AND Casos_Uso.id_casos=? AND Casos_Uso.id_casos = Entrega.id_casos AND id_proyecto=?', 
        [idIteracion, idCaso, idProyecto]);
    }

    static dropEntrega(idProyecto, idFase, idTarea, idCaso) {
        return db.execute('DELETE FROM entrega WHERE id_proyecto=? AND id_fase=? AND id_tarea=? AND id_casos=?', 
        [idProyecto, idFase, idTarea, idCaso]);
    }

    static fetchCostosDiarios(id_iteracion){
        return db.execute('SELECT DATE_FORMAT(E.entrega_real, "%M %d %Y")AS entrega_real, SUM(E.valor_ganado) AS valor_ganado_diario, SUM(E.costo_real) AS costo_real_diario FROM Entrega E, Iteracion I, Casos_uso C WHERE I.id_iteracion = C.id_iteracion AND E.id_casos = C.id_casos AND I.id_iteracion =? AND estado_entrega = 1 GROUP BY E.entrega_estimada, E.entrega_real ORDER BY E.entrega_real ASC', [id_iteracion]);
    }
}