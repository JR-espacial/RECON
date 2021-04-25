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
        return db.execute('INSERT INTO proyecto (nombre_proyecto, descripcion, imagen, fecha_inicio, fecha_fin, estado_proyecto, proyecto_terminado) VALUES (?, ?, ?, CURRENT_DATE(), NULL, ?,?)',
        [this.nombre_proyecto, this.descripcion, this.imagen, this.estado_proyecto, this.proyecto_terminado]);
    }

    static saveProyectoDepto(id_departamento, id_proyecto){
        return db.execute('INSERT INTO proyecto_departamento (id_proyecto, id_departamento) VALUES (?, ?)',
        [id_proyecto, id_departamento]);
    }

    static fetchAll(usuario){
        return db.execute('SELECT *, P.descripcion AS descripcion_proyecto FROM proyecto P, iteracion I, empleado_iteracion EI, empleado E, Departamento D, Proyecto_departamento PD WHERE estado_proyecto = 1 AND P.id_proyecto = I.id_proyecto AND I.id_iteracion = EI.id_iteracion AND EI.id_empleado = E.id_empleado AND P.id_proyecto = PD.id_proyecto AND PD.id_departamento = D.id_departamento AND E.usuario =? GROUP BY P.id_proyecto', [usuario]);
    }

    static fetchOne(nombre_proyecto){ 
        return db.execute('SELECT id_proyecto FROM proyecto WHERE nombre_proyecto =?',[nombre_proyecto]);
    }

    static fetchAllProyectoIter(id_iteracion) {
        console.log(id_iteracion);
        return db.execute('SELECT id_proyecto FROM iteracion WHERE id_iteracion IN ? AND estado_iteracion = 1',[id_iteracion]);
    }

    static fetchOneModificar(nombre_proyecto, id_proyecto){ 
        return db.execute('SELECT id_proyecto FROM proyecto WHERE nombre_proyecto =? AND NOT id_proyecto =?',[nombre_proyecto, id_proyecto]);
    }

    static modificarProyecto(nombre_proyecto, descripcion, image_file_name, id_proyecto){
        return db.execute('UPDATE proyecto SET nombre_proyecto = ?, descripcion = ?, imagen = ? WHERE id_proyecto = ?', [nombre_proyecto, descripcion, image_file_name, id_proyecto]);
    }

    static modificarProyectoDepto(id_departamento, id_proyecto){
        return db.execute('UPDATE proyecto_departamento SET id_departamento = ? WHERE id_proyecto = ?', [id_departamento, id_proyecto]);
    }

    static eliminarProyecto(id_proyecto){
        return db.execute('UPDATE proyecto SET estado_proyecto = 0 WHERE id_proyecto = ?', [id_proyecto]);
    }

    static saveAirTableKeys(base, API_key, id_proyecto){
        return db.execute('UPDATE proyecto SET base = ?, API_key = ? WHERE id_proyecto = ?', [base, API_key, id_proyecto]);
    }

    static fetchAirTableKeys(id_proyecto){
        return db.execute('SELECT base, API_key FROM proyecto WHERE id_proyecto = ?', [id_proyecto]);
    }
}