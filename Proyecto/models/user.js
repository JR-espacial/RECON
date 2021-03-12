const db = require('../util/database');

module.exports =  class Usuario{
    constructor(nombre_empleado, usuario, contrasena){
        this.nombre_empleado = nombre_empleado;
        this.usuario = usuario;
        this.contrasena = contrasena;
    }
    save(){ 
        return db.execute('INSERT INTO Empleado (nombre_empleado, usuario, contrasena) VALUES (?, ?, ?)',
        [this.nombre_empleado, this.usuario, this.contrasena]
    );
    }
    

    static fetchAll(){
        return db.execute('SELECT * FROM Empleado');
    }

    static fetchOne(usuario){
        return db('SELECT * FROM Empleado WHERE usuario =\''+ usuario +'\''
        );
    }
}