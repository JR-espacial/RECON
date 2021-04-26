const db = require('../util/mySQL');

module.exports =  class Departamento{
    constructor(nombre_departamento){
        this.nombre_departamento = nombre_departamento;
    }

    saveDepartamento(){ 
        return db.execute('INSERT INTO departamento (nombre_departamento) VALUES (?);',
        [this.nombre_departamento]);
    }
    
    static fetchAll(){
        return db.execute('SELECT * FROM departamento ORDER BY nombre_departamento ASC;');
    }

    static fetchAllProyecto(){
        return db.execute('SELECT * FROM proyecto_departamento;');
    }

    static fetchOne(nombre_departamento){
        return db.execute('SELECT nombre_departamento FROM departamento WHERE nombre_departamento = ?;', [nombre_departamento]);
    }
}