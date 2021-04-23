const Usuario = require('../models/user');
const Departamento = require('../models/departamento');
const bcrypt = require('bcryptjs');

exports.getLogin = (request, response, next) => {
    response.render("login", {
        user: request.session.usuario,
        title: "Log In",
        error: request.session.error,
        csrfToken: request.csrfToken(),
        isLoggedIn: request.session.isLoggedIn === true ? true : false,
        proyecto_actual: request.session.nombreProyecto,
        navegacion : request.session.navegacion
    });
};

exports.postLogin = (request, response, next) => {
    request.session.error = "";
    const username = request.body.usuario;
    Usuario.fetchOne(username)
        .then(([rows, fieldData]) => {
            if (rows.length < 1) {
                request.session.error = "El usuario y/o contraseña no coinciden";
                response.redirect('/users/login');
            } else {
                bcrypt.compare(request.body.password, rows[0].contrasena)
                    .then(doMatch => {
                        if (doMatch) {
                            request.session.id_empleado = rows[0].id_empleado;
                            request.session.imagen_empleado = rows[0].imagen_empleado;
                            request.session.isLoggedIn = true;
                            request.session.usuario = request.body.usuario;
                            return request.session.save(err => {
                                response.redirect('/home');
                            });
                        }
                        request.session.error = "El usuario y/o contraseña no coinciden";
                        response.redirect('/users/login');
                    }).catch(err => {
                        request.session.error = "El usuario y/o contraseña no coinciden";
                        response.redirect('/users/login');
                    });
            }
        })
        .catch(err => {
            console.log(err);
        });
};

exports.getLogout = (request, response, next) => {
    request.session.destroy(() => {
        response.redirect('/users/login');
    });
}

exports.getRegister = (request, response, next) => {
    const alerta = request.session.alerta;
    request.session.alerta = "";
    response.render('registrar', {
        imagen_empleado: request.session.imagen_empleado,
        user: request.session.usuario,
        alerta: alerta,
        title: 'Registra tus datos',
        csrfToken: request.csrfToken(),
        isLoggedIn: request.session.isLoggedIn === true ? true : false
    });
};

exports.postRegister = (request, response, next) => {
    const image = request.file;
    let image_file_name = '';

    if(!image) {
        image_file_name = 'https://d3ipks40p8ekbx.cloudfront.net/dam/jcr:3a4e5787-d665-4331-bfa2-76dd0c006c1b/user_icon.png';
    }
    else{
        image_file_name = image.filename;
    }

    const nuevo_usuario = new Usuario(request.body.nombre, request.body.usuario, request.body.password, image_file_name);
    nuevo_usuario.save()
        .then(() => {
            request.session.alerta = "Usuario registrado exitosamente";
            response.redirect('/users/register');
        }).catch(err => console.log(err));

}

exports.getSettings = async function (request, response, next) {
    const alerta = request.session.alerta;
    request.session.alerta = "";
    let user = await Usuario.fetchOne(request.session.usuario);
    let users = await Usuario.fetchAll();


    response.render('modificarUsuario', {
        users: users[0],
        user: user[0][0],
        imagen_empleado: request.session.imagen_empleado,
        alerta: alerta,
        title: 'Modifica tus datos',
        csrfToken: request.csrfToken(),
        isLoggedIn: request.session.isLoggedIn === true ? true : false
    });
};

exports.postSettings = (request, response) => {
    let option_ = request.body.option;
    let id_empleado = request.body.id_empleado;

    if(option_ == 1){
        let image = request.file;

        if(!image) {
            request.session.alerta = "Error al subir imagen";
            response.redirect('/users/settings');
        }
        else{
            Usuario.updateImagen(image.filename,id_empleado)
            .then(() => {
                request.session.alerta = "Imagen modificada exitosamente";
                request.session.imagen_empleado =image.filename;
                response.redirect('/users/settings');
            }).catch(err => console.log(err));
        }
    }
    else if(option_ == 2){
        let nombre= request.body.nombre;
        Usuario.updateNombre(nombre,id_empleado)
            .then(() => {
                request.session.alerta = "Nombre modificado exitosamente";
                response.redirect('/users/settings');
            }).catch(err => console.log(err));
    }
    else if(option_ == 3){
        let usuario= request.body.usuario;
        Usuario.updateUsuario(usuario,id_empleado)
            .then(() => {
                request.session.usuario = usuario;
                request.session.alerta = "Usuario modificado exitosamente";
                response.redirect('/users/settings');
            }).catch(err => console.log(err));
        
    }
    else if(option_ == 4){
        let antiguo_password= request.body.antiguo_password;
        let nuevo_password= request.body.nuevo_password;

        let username = request.session.usuario;
        Usuario.fetchOne(username)
            .then(([rows, fieldData]) => {
                bcrypt.compare(antiguo_password, rows[0].contrasena)
                    .then(doMatch => {
                        if (doMatch) {
                            Usuario.updateContrasena(nuevo_password,id_empleado)
                            .then(() => {
                                request.session.alerta = "Contraseña modificado exitosamente";
                                response.redirect('/users/settings');
                            }).catch(err => console.log(err));
                        }
                        else{
                            request.session.alerta = "La antigua contraseña no es correcta";
                            response.redirect('/users/settings');
                        }
                    }).catch(err => {
                        request.session.alerta = "La antigua contraseña no es correcta";
                        response.redirect('/users/settings');
                    });
            })
            .catch(err => {
                console.log(err);
            });

        
    }
    else{
        response.redirect('/users/settings');
    }
}

exports.postEliminarUsuario = async function(request,response){
    await Usuario.eliminarEmpleadoIteracion(request.body.usuario);
    await Usuario.eliminarEmpleado(request.body.usuario);

    request.session.alerta = "Usuario eliminado";
    response.redirect('/users/settings');

}