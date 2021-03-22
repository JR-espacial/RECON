const db = require('../util/mySQL');

module.exports =  class Casos_Uso{
    constructor(id_ap, id_iteracion, yo_como, quiero, para){
        this.id_ap = id_ap;
        this.id_iteracion = id_iteracion;
        this.yo_como = yo_como;
        this.quiero = quiero;
        this.para = para;
    }

    saveCaso(){ 
        return db.execute('INSERT INTO Casos_uso (id_ap, id_iteracion, yo_como, quiero, para) VALUES (?, ?, ?, ?, ?)',
        [this.id_ap, this.id_iteracion, this.yo_como, this.quiero, this.para]);
    }

    static fetchAllwithAPvalues () {
        return db.execute('SELECT id_casos, yo_como, quiero, para, ap FROM Casos_Uso, Puntos_Agiles WHERE Casos_Uso.id_ap = Puntos_Agiles.id_ap');
    }

    static fetchAllIteracion(idIteracion) {
        return db.execute('SELECT id_casos, yo_como, quiero, para, ap FROM Casos_Uso, Puntos_Agiles WHERE Casos_Uso.id_iteracion=? AND Casos_Uso.id_ap = Puntos_Agiles.id_ap', 
        [idIteracion]
        );
    }

    static DropEntreCaso(idCaso) {
        return db.execute('DELETE FROM entrega WHERE id_casos=?', [idCaso]);
    }

    static DropCasoUso(idCaso) {
        return db.execute('DELETE FROM casos_uso WHERE id_casos=?', [idCaso]);
    }

    /*
    static fetchOneIteracion(nombre_fase){ 
        return db.execute('SELECT id_fase FROM Fase WHERE nombre_fase =?',[nombre_fase]);
    }
    */
}