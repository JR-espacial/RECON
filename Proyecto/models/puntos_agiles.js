const db = require('../util/mySQL');

module.exports =  class Puntos_Agiles{
    constructor(ap){
        this.ap = ap;
    }

    saveAP(){ 
        return db.execute('INSERT INTO Puntos_Agiles (ap) VALUES (?)',
        [this.ap]);
    }

    static fetchAll(){
        return db.execute('SELECT * FROM Puntos_Agiles');
    }

    static fetchValorAP(idAP){ 
        return db.execute('SELECT ap FROM Puntos_Agiles WHERE id_ap =?', [idAP]);
    }
}