const db = require('../util/mySQL');

module.exports =  class Departamento{
    constructor(id_departamento, nombre_departamento){
        this.id_departamento = id_departamento;
        this.nombre_departamento = nombre_departamento;
    }
    
    static fetchAll(){
        return db.execute('SELECT * FROM Departamento');
    }
}