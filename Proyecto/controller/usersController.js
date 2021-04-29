const Usuario = require('../models/user');
const Departamento = require('../models/departamento');
const bcrypt = require('bcryptjs');
const passwordValidator = require('password-validator');

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
                            request.session.idRol = rows[0].id_rol;
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
    let alerta = request.session.alerta;
    request.session.alerta = "";
    let error = request.session.error;
    request.session.error = "";
    response.render('registrar', {
        imagen_empleado: request.session.imagen_empleado,
        user: request.session.usuario,
        error: error,
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

    let schema = new passwordValidator();

    schema
    .is().min(8)                                    // Minimum length 8
    .is().max(100)                                  // Maximum length 100
    .has().uppercase()                              // Must have uppercase letters
    .has().lowercase()                              // Must have lowercase letters
    .has().digits()                                // Must have at least  digits
    .has().symbols()                               //Must have symbols
    .has().not().spaces()                           // Should not have spaces

    Usuario.fetchOne(request.body.usuario)
        .then(([rows, fieldData]) => {
            if(rows[0]){
                request.session.error = "El nombre de usuario ingresado ya existe";
                response.redirect('/users/register');
            }
            else if(schema.validate(request.body.password)){
                const nuevo_usuario = new Usuario(request.body.nombre, request.body.usuario, request.body.correo,request.body.password , image_file_name);
                nuevo_usuario.save()
                    .then(() => {
                        request.session.alerta = "Usuario registrado exitosamente";
                        response.redirect('/users/register');
                    }).catch(err => console.log(err));
            }
            else{
                let error = schema.validate(request.body.password, { list: true });
                let mensaje;
                if(error[0] == 'min'){
                    mensaje = "La contraseña debe tener al menos 8 caracteres";
                }
                else if(error[0] == 'max'){
                    mensaje = "La contraseña debe tener máximo caracteres";
                    
                }
                else if(error[0] == 'uppercase'){
                    mensaje = "La contraseña debe contener al menos una mayúscula";
                    
                }
                else if(error[0] == 'lowercase'){
                    mensaje = "La contraseña debe contener al menos una minúscula"; 
                }
                else if(error[0] == 'digits'){
                    mensaje = "La contraseña debe contener al menos un número";
                    
                }
                else if(error[0] == 'symbols'){
                    mensaje = "La contraseña debe contener al menos una carácter especial";
                    
                }
                else if(error[0] == 'spaces'){
                    mensaje = "La contraseña no debe contener espacios";
                    
                }
        
                request.session.error = mensaje;
                response.redirect('/users/register');
                
            }  
        })
        .catch(err => {
            console.log(err);
        });
}

exports.getSettings = async function (request, response, next) {
    const alerta = request.session.alerta;
    const toast = request.session.toast;
    request.session.alerta = "";
    request.session.toast = "";
    let user = await Usuario.fetchOne(request.session.usuario);
    let users = await Usuario.fetchAll();

    let error = request.session.error;
    request.session.error = "";

    response.render('modificarUsuario', {
        users: users[0],
        user: user[0][0],
        error: error,
        imagen_empleado: request.session.imagen_empleado,
        alerta: alerta,
        toast: toast,
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
            request.session.toast = "Error al subir imagen";
            response.redirect('/users/settings');
        }
        else{
            Usuario.updateImagen(image.filename,id_empleado)
            .then(() => {
                request.session.toast = "Imagen modificada exitosamente";
                request.session.imagen_empleado =image.filename;
                response.redirect('/users/settings');
            }).catch(err => console.log(err));
        }
    }
    else if(option_ == 2){
        let nombre= request.body.nombre;
        Usuario.updateNombre(nombre,id_empleado)
            .then(() => {
                request.session.toast = "Nombre modificado exitosamente";
                response.redirect('/users/settings');
            }).catch(err => console.log(err));
    }
    else if(option_ == 3){
        let usuario = request.body.usuario;
        Usuario.fetchOne(usuario)
        .then(([rows, fieldData]) => {
            if(rows[0]){ 
                request.session.alerta = "El nombre de usuario ingresado ya existe";
                response.redirect('/users/settings');
            }
            else{
                Usuario.updateUsuario(usuario,id_empleado)
                .then(() => {
                    request.session.usuario = usuario;
                    request.session.toast = "Usuario modificado exitosamente";
                    response.redirect('/users/settings');
                }).catch(err => console.log(err));
            }
        })
        .catch(err => {
            console.log(err);
        });
    }
    else if(option_ == 4){
        let correo = request.body.correo;
        Usuario.updateCorreo(correo,id_empleado)
        .then(() => {
            request.session.correo = correo;
            request.session.toast = "Correo modificado exitosamente";
            response.redirect('/users/settings');
        }).catch(err => console.log(err));

    }
    else if(option_ == 5){
        let antiguo_password= request.body.antiguo_password;
        let nuevo_password= request.body.nuevo_password;

        let username = request.session.usuario;
        Usuario.fetchOne(username)
            .then(([rows, fieldData]) => {
                bcrypt.compare(antiguo_password, rows[0].contrasena)
                    .then(doMatch => {
                        if (doMatch) {
                            let schema = new passwordValidator();
                            schema
                            .is().min(8)                                    // Minimum length 8
                            .is().max(100)                                  // Maximum length 100
                            .has().uppercase()                              // Must have uppercase letters
                            .has().lowercase()                              // Must have lowercase letters
                            .has().digits()                                // Must have at least  digits
                            .has().symbols()                               //Must have symbols
                            .has().not().spaces()                           // Should not have spaces

                            if(schema.validate(nuevo_password)){
                                Usuario.updateContrasena(nuevo_password,id_empleado)
                                .then(() => {
                                request.session.toast = "Contraseña modificado exitosamente";
                                response.redirect('/users/settings');
                                }).catch(err => console.log(err));
                            }
                            else{
                                let error = schema.validate(nuevo_password, { list: true });
                                let mensaje;
                                if(error[0] == 'min'){
                                    mensaje = "La nueva contraseña debe tener al menos 8 caracteres";
                                }
                                else if(error[0] == 'max'){
                                    mensaje = "La nueva contraseña debe tener máximo caracteres";
                                    
                                }
                                else if(error[0] == 'uppercase'){
                                    mensaje = "La nueva contraseña debe contener al menos una mayúscula";
                                    
                                }
                                else if(error[0] == 'lowercase'){
                                    mensaje = "La nueva contraseña debe contener al menos una minúscula"; 
                                }
                                else if(error[0] == 'digits'){
                                    mensaje = "La nueva contraseña debe contener al menos un número";
                                    
                                }
                                else if(error[0] == 'symbols'){
                                    mensaje = "La nueva contraseña debe contener al menos una carácter especial";
                                    
                                }
                                else if(error[0] == 'spaces'){
                                    mensaje = "La nueva contraseña no debe contener espacios";
                                    
                                }

                                request.session.alerta = mensaje;
                                request.session.error = mensaje;
                                response.redirect('/users/settings');
                                
                            }  
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