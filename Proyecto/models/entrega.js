const db = require('../util/mySQL');


module.exports =  class Entrega {
    constructor(id_proyecto, id_fase, id_tarea, id_caso) {
        this.id_proyecto = id_proyecto;
        this.id_fase = id_fase;
        this.id_tarea = id_tarea;
        this.id_caso = id_caso;
        this.estado_entrega = '0';
    }

    static crearEntrega(idProyecto, idFase, idTarea, idCaso, estimacion) {
        return db.execute('INSERT INTO entrega (id_proyecto, id_fase, id_tarea, id_casos, estimacion) VALUES (?, ?, ?, ?, ?)', 
        [idProyecto, idFase, idTarea, idCaso, estimacion]);
    }

    static fetchAll() {
        return db.execute('SELECT * FROM Entrega');
    }

    static fetchEntregaFase(idProyecto, idFase) {
        return db.execute('SELECT * FROM entrega WHERE id_proyecto=? AND id_fase=?', 
        [idProyecto, idFase]);
    }

    static fetchEntregaTarea(idProyecto, idFase, idTarea) {
        return db.execute('SELECT * FROM entrega WHERE id_proyecto=? AND id_fase=? AND id_tarea=?', 
        [idProyecto, idFase, idTarea]);
    }
    
    static fetchTareaDeCaso(idProyecto, idIteracion, idCaso) {
        return db.execute('SELECT id_fase, id_tarea FROM entrega, casos_uso WHERE id_iteracion=? AND Casos_Uso.id_casos=? AND Casos_Uso.id_casos = Entrega.id_casos AND id_proyecto=? AND id_tarea > 0', 
        [idIteracion, idCaso, idProyecto]);
    }

    static dropEntrega(idProyecto, idFase, idTarea, idCaso) {
        return db.execute('DELETE FROM entrega WHERE id_proyecto=? AND id_fase=? AND id_tarea=? AND id_casos=?', 
        [idProyecto, idFase, idTarea, idCaso]);
    }

    static fetchCostosDiarios(id_iteracion){
        return db.execute('SELECT DATE_FORMAT(E.entrega_real, "%d/%m/%Y")AS entrega_real, SUM(E.valor_ganado) AS valor_ganado_diario, SUM(E.costo_real) AS costo_real_diario FROM Entrega E, Iteracion I, Casos_uso C WHERE I.id_iteracion = C.id_iteracion AND E.id_casos = C.id_casos AND I.id_iteracion =? AND estado_entrega = 1 GROUP BY  E.entrega_real ORDER BY E.entrega_real ASC', [id_iteracion]);
    }
    static countAllTareas(id_iteracion){
        return db.execute('SELECT COUNT(id_proyecto) as tareas_totales FROM Entrega E,Casos_Uso CU WHERE E.id_casos = CU.id_casos AND CU.id_iteracion = ?',[id_iteracion]);
    }
    static countTareasCompletadas(id_iteracion){
        return db.execute('SELECT COUNT(id_proyecto) as tareas_completadas FROM Entrega E,Casos_Uso CU WHERE E.id_casos = CU.id_casos AND E.estado_entrega = 1 AND CU.id_iteracion = ?',[id_iteracion]);
    }

    static updateAirtable(nombre, entrega_real, estimacion, valor_ganado, costo_real, estado_entrega){
        return db.execute('UPDATE Entrega SET entrega_real = ?, estimacion = ?, valor_ganado = ?, costo_real = ?, estado_entrega = ? WHERE nombre = ?',
        [entrega_real,estimacion,valor_ganado,costo_real,estado_entrega,nombre]);
    }

    static setNombreEstimacion (id_proyecto, id_fase, id_tarea, id_casos){
        return db.execute('CALL setNombreEstimacion(?, ?, ?, ?)', [id_proyecto, id_fase, id_tarea, id_casos])
    }

}