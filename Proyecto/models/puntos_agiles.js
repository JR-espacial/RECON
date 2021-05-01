const db = require('../util/mySQL');

module.exports =  class puntos_agiles{
    constructor(ap){
        this.ap = ap;
    }

    saveAP(){ 
        return db.execute('INSERT INTO puntos_agiles (ap) VALUES (?)',
        [this.ap]);
    }

    static fetchAll(){
        return db.execute('SELECT * FROM puntos_agiles');
    }

    static fetchValorAP(idAP){ 
        return db.execute('SELECT ap FROM puntos_agiles WHERE id_ap =?', [idAP]);
    }
}