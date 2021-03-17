const db = require('../util/mySQL');

module.exports =  class Proyecto{
    constructor(nombre_proyecto, descripcion, departamento){
        this.nombre_proyecto = nombre_proyecto;
        this.descripcion = descripcion;
    }

    saveProyecto(){ 
        return db.execute('INSERT INTO Proyecto (nombre_proyecto, descripcion, fecha_inicio, fecha_fin) VALUES (?, ?, CURRENT_DATE(),NULL)',
        [this.nombre_proyecto, this.descripcion]);
    }

    static saveProyectoDepto(id_departamento, id_proyecto){
        return db.execute('INSERT INTO Proyecto_Departamento (id_proyecto, id_departamento) VALUES (?, ?)',
        [id_proyecto, id_departamento]);
    }
    

    static fetchAll(){
        return db.execute('SELECT * FROM Proyecto');
    }

    static fetchOne(nombre_proyecto){ 
        return db.execute('SELECT id_proyecto FROM Proyecto WHERE nombre_proyecto =?',[nombre_proyecto]);
    }
}