const db = require('../util/mySQL');

module.exports =  class Proyecto{
    constructor(nombre_proyecto, descripcion, departamento){
        this.nombre_proyecto = nombre_proyecto;
        this.descripcion = descripcion;
    }

    save(){ 
        return db.execute('INSERT INTO Proyecto (nombre_proyecto, descripcion, fecha_inicio, fecha_fin) VALUES (?, ?, CURRENT_DATE(),NULL)',
        [this.nombre_proyecto, this.descripcion]
    );
    }
    

    static fetchAll(){
        return db.execute('SELECT * FROM Proyecto');
    }

    static fetchOne(nombre_proyecto){
        
        return db.execute('SELECT * FROM Proyecto WHERE nombre_proyecto =?',[nombre_proyecto]);

    }
}