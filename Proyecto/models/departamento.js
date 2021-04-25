const db = require('../util/mySQL');

module.exports =  class Departamento{
    constructor(nombre_departamento){
        this.nombre_departamento = nombre_departamento;
    }

    saveDepartamento(){ 
        return db.execute('INSERT INTO departamento (nombre_departamento) VALUES (?)',
        [this.nombre_departamento]);
    }
    
    static fetchAll(){
        return db.execute('SELECT * FROM departamento');
    }

    static fetchAllProyecto(){
        return db.execute('SELECT * FROM proyecto_departamento');
    }
}