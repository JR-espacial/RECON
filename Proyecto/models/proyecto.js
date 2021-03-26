const db = require('../util/mySQL');

module.exports =  class Proyecto{
    constructor(nombre_proyecto, descripcion, departamento, estado_proyecto){
        this.nombre_proyecto = nombre_proyecto;
        this.descripcion = descripcion;
        this.estado_proyecto = estado_proyecto;

    }

    saveProyecto(){ 
        return db.execute('INSERT INTO Proyecto (nombre_proyecto, descripcion, fecha_inicio, fecha_fin, estado_proyecto) VALUES (?, ?, CURRENT_DATE(), NULL, ?)',
        [this.nombre_proyecto, this.descripcion, this.estado_proyecto]);
    }

    static saveProyectoDepto(id_departamento, id_proyecto){
        return db.execute('INSERT INTO Proyecto_Departamento (id_proyecto, id_departamento) VALUES (?, ?)',
        [id_proyecto, id_departamento]);
    }
    
    static fetchAll(){
        return db.execute('SELECT * FROM Proyecto P, Proyecto_Departamento PD, Departamento D WHERE estado_proyecto = 1 AND P.id_proyecto = PD.id_proyecto AND PD.id_departamento = D.id_departamento');
    }

    static fetchOne(nombre_proyecto){ 
        return db.execute('SELECT id_proyecto FROM Proyecto WHERE nombre_proyecto =?',[nombre_proyecto]);
    }

    static fetchOneModificar(nombre_proyecto, id_proyecto){ 
        return db.execute('SELECT id_proyecto FROM Proyecto WHERE nombre_proyecto =? AND NOT id_proyecto = ?',[nombre_proyecto, id_proyecto]);
    }

    static modificarProyecto(nombre_proyecto, descripcion, id_proyecto){
        return db.execute('UPDATE Proyecto SET nombre_proyecto = ?, descripcion = ? WHERE id_proyecto = ?', [nombre_proyecto, descripcion, id_proyecto]);
    }

    static modificarProyectoDepto(id_departamento, id_proyecto){
        return db.execute('UPDATE Proyecto_Departamento SET id_departamento = ? WHERE id_proyecto = ?', [id_departamento, id_proyecto]);
    }

    static eliminarProyecto(id_proyecto){
        return db.execute('UPDATE Proyecto SET estado_proyecto = 0 WHERE id_proyecto = ?', [id_proyecto]);
    }

}