const db = require('../util/mySQL');

module.exports =  class Casos_Uso{
    constructor(id_ap, id_iteracion, yo_como, quiero, para){
        this.id_ap = id_ap;
        this.id_iteracion = id_iteracion;
        this.yo_como = yo_como;
        this.quiero = quiero;
        this.para = para;
        this.comentario = "";
    }

    saveCaso(){ 
        return db.execute('INSERT INTO Casos_uso (id_ap, id_iteracion, yo_como, quiero, para, comentario) VALUES (?, ?, ?, ?, ?, ?)',
        [this.id_ap, this.id_iteracion, this.yo_como, this.quiero, this.para, this.comentario]);
    }

    // static fetchAllwithAPvalues () {
    //     return db.execute('SELECT id_casos, yo_como, quiero, para, ap FROM Casos_Uso, Puntos_Agiles WHERE Casos_Uso.id_ap = Puntos_Agiles.id_ap');
    // }

    static fetchAllIteracion(idIteracion) {
        return db.execute('SELECT id_casos, Casos_Uso.id_ap, yo_como, quiero, para, ap, comentario FROM Casos_Uso, Puntos_Agiles WHERE Casos_Uso.id_iteracion=? AND Casos_Uso.id_ap = Puntos_Agiles.id_ap', 
        [idIteracion]);
    }

    static fetchQuiero (idIteracion) {
        return db.execute('SELECT id_casos, id_iteracion, quiero FROM Casos_Uso WHERE id_iteracion=?', 
        [idIteracion]);
    }

    static ModifyCaso(idCaso, idAp, yo_como, quiero, para, comentario) {
        return db.execute('UPDATE casos_uso SET id_ap=?, yo_como=?, quiero=?, para=?, comentario=? WHERE id_casos=?', 
        [idAp, yo_como, quiero, para, comentario, idCaso]);
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