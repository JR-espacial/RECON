const db = require('../util/mySQL');


module.exports =  class Tarea{
    constructor(nombre_tarea){
        this.nombre_tarea = nombre_tarea;
    }

    saveTarea(){ 
        return db.execute('INSERT INTO tarea (nombre_tarea) VALUES (?)',
        [this.nombre_tarea]);
    }

    static fetchAll(){
        return db.execute('SELECT * FROM tarea');
    }

    static fetchOne(nombre_tarea){ 
        return db.execute('SELECT id_tarea FROM tarea WHERE nombre_tarea =?',[nombre_tarea]);
    }

    static fetchAllFromProyecto(id_proyecto, id_fase){
        return db.execute('SELECT * FROM tarea WHERE id_tarea IN (SELECT id_tarea FROM proyecto_fase_practica WHERE id_proyecto =? AND id_fase =?)', [id_proyecto, id_fase]);
    }
}