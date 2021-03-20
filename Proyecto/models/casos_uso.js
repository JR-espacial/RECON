const db = require('../util/mySQL');

module.exports =  class Casos_Uso{
    constructor(yo_como, quiero, para, ap){
        this.yo_como = yo_como;
        this.quiero = quiero;
        this.para = para;
        this.ap = ap;
    }

    // Joaquin 
    /*
    saveCaso(){ 
        return db.execute('INSERT INTO Fase (nombre_fase) VALUES (?)',
        [this.nombre_fase]);
    }
    */
    static fetchAll(){
        return db.execute('SELECT * FROM Casos_Uso');
    }

    /*
    static fetchOneIteracion(nombre_fase){ 
        return db.execute('SELECT id_fase FROM Fase WHERE nombre_fase =?',[nombre_fase]);
    }
    */
}