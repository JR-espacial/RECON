const db = require('../util/mySQL');
const bcrypt = require('bcryptjs');

module.exports =  class Usuario{
    constructor(nombre_empleado, usuario, contrasena){
        this.nombre_empleado = nombre_empleado;
        this.usuario = usuario;
        this.contrasena = contrasena;
    }

    save() {
        return bcrypt.hash(this.contrasena, 12)
            .then((password_encriptado) => {
                return db.execute(
                    'INSERT INTO Empleado (nombre_empleado, usuario, contrasena) VALUES (?, ?, ?)',
                    [this.nombre_empleado, this.usuario, password_encriptado]
                );
            }).catch(err => console.log(err));  
    }

    static fetchAll(){
        return db.execute('SELECT * FROM Empleado');
    }

    static fetchOne(usuario){
        return db.execute('SELECT * FROM Empleado WHERE usuario =?',[usuario]);

    }
}