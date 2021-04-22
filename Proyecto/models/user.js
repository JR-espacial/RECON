const db = require('../util/mySQL');
const bcrypt = require('bcryptjs');

module.exports =  class Usuario{
    constructor(nombre_empleado, usuario, contrasena, imagen_empleado){
        this.nombre_empleado = nombre_empleado;
        this.usuario = usuario;
        this.contrasena = contrasena;
        this.imagen_empleado = imagen_empleado;
    }

    save() {
        return bcrypt.hash(this.contrasena, 12)
            .then((password_encriptado) => {
                return db.execute(
                    'INSERT INTO Empleado (nombre_empleado, usuario, contrasena, imagen_empleado) VALUES (?, ?, ?, ?)',
                    [this.nombre_empleado, this.usuario, password_encriptado, this.imagen_empleado]
                );
            }).catch(err => console.log(err));  
    }

    static fetchAll(){
        return db.execute('SELECT * FROM Empleado');
    }

    static fetchOne(usuario){
        return db.execute('SELECT * FROM Empleado WHERE usuario =?',[usuario]);

    }

    static fetchEmpleadoIter(id_empleado){
        return db.execute('SELECT id_iteracion FROM Empleado_Iteracion WHERE id_empleado =?', [id_empleado]);
    }
}