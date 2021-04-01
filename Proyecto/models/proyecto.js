const db = require('../util/mySQL');

module.exports =  class Proyecto{
    constructor(nombre_proyecto, descripcion, departamento, estado_proyecto, imagen, proyecto_terminado){
        this.nombre_proyecto = nombre_proyecto;
        this.descripcion = descripcion;
        this.estado_proyecto = estado_proyecto;
        this.imagen = imagen;
        this.proyecto_terminado = proyecto_terminado;
    }

    saveProyecto(){ 
        return db.execute('INSERT INTO Proyecto (nombre_proyecto, descripcion, imagen, fecha_inicio, fecha_fin, estado_proyecto, proyecto_terminado) VALUES (?, ?, ?, CURRENT_DATE(), NULL, ?,?)',
        [this.nombre_proyecto, this.descripcion, this.imagen, this.estado_proyecto, this.proyecto_terminado]);
    }

    static saveProyectoDepto(id_departamento, id_proyecto){
        return db.execute('INSERT INTO Proyecto_Departamento (id_proyecto, id_departamento) VALUES (?, ?)',
        [id_proyecto, id_departamento]);
    }

    static fetchAll(usuario){
        return db.execute('SELECT * FROM Proyecto P, Iteracion I, Empleado_Iteracion EI, Empleado E  WHERE estado_proyecto = 1 AND P.id_proyecto = I.id_proyecto AND I.id_iteracion = EI.id_iteracion AND EI.id_empleado = E.id_empleado AND E.usuario = ? GROUP BY P.id_proyecto', [usuario]);
    }

    static fetchOne(nombre_proyecto){ 
        return db.execute('SELECT id_proyecto FROM Proyecto WHERE nombre_proyecto =?',[nombre_proyecto]);
    }

    static fetchAllProyectoIter(id_iteracion) {
        console.log(id_iteracion);
        return db.execute('SELECT id_proyecto FROM Iteracion WHERE id_iteracion IN ? AND estado_iteracion = 1',[id_iteracion]);
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