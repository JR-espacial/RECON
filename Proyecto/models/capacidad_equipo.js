const db = require('../util/mySQL');

module.exports =  class Capacidad_Equipo{
    constructor(id_capacidad){
        this.id_capacidad = id_capacidad;
    }
    
    static fetchAll(){
        return db.execute('SELECT * FROM Capacidad_Equipo');
    }

    static fetchOne(id_capacidad){
        return db.execute('SELECT * FROM Capacidad_Equipo WHERE id_capacidad =?', [id_capacidad]);
    }
}