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
}