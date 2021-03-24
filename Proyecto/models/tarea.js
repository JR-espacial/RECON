const db = require('../util/mySQL');


module.exports =  class Tarea{
    constructor(nombre_practica_trabajo){
        this.nombre_practica_trabajo = nombre_practica_trabajo;
    }

    saveTarea(){ 
        return db.execute('INSERT INTO practica_trabajo (nombre_practica_trabajo) VALUES (?)',
        [this.nombre_practica_trabajo]);
    }

    static fetchAll(){
        return db.execute('SELECT * FROM practica_trabajo');
    }

    static fetchOne(nombre_practica_trabajo){ 
        return db.execute('SELECT id_trabajo FROM practica_trabajo WHERE nombre_practica_trabajo =?',[nombre_practica_trabajo]);
    }

    static fetchAllFromProyecto(id_proyecto, id_fase){
        return db.execute('SELECT * FROM practica_trabajo WHERE id_trabajo IN (SELECT id_trabajo FROM proyecto_fase_practica WHERE id_proyecto =? AND id_fase =?)', [id_proyecto, id_fase]);
    }
}