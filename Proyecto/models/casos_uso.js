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
    static fetchAllwithAPvalues () {
        return db.execute('SELECT id_casos, yo_como, quiero, para, ap FROM Casos_Uso, Puntos_Agiles WHERE Casos_Uso.id_ap = Puntos_Agiles.id_ap');
    }

    /*
    static fetchOneIteracion(nombre_fase){ 
        return db.execute('SELECT id_fase FROM Fase WHERE nombre_fase =?',[nombre_fase]);
    }
    */
}