const db = require('../util/mySQL');

module.exports =  class Fase{
    constructor(nombre_fase){
        this.nombre_fase = nombre_fase;
    }

    saveFase(){ 
        return db.execute('INSERT INTO Fase (nombre_fase) VALUES (?)',
        [this.nombre_fase]);
    }

    static fetchAll(){
        return db.execute('SELECT * FROM Fase');
    }

    static fetchOne(nombre_fase){ 
        return db.execute('SELECT id_fase FROM Fase WHERE nombre_fase =?',[nombre_fase]);
    }

    static fetchAllFromProyecto(id_proyecto){
        return db.execute('SELECT * FROM Fase WHERE id_fase IN (SELECT id_fase FROM proyecto_fase_practica WHERE id_proyecto =?)', [id_proyecto]);
    }

    static fetchAllNotInProject(id_proyecto) {
        return db.execute('SELECT nombre_fase FROM Fase WHERE id_fase NOT IN (SELECT DISTINCT id_fase FROM proyecto_fase_practica WHERE id_proyecto =?)', [id_proyecto]);
    }
}