const Usuario = require('../models/user');
const bcrypt = require('bcryptjs');

exports.getLogin = (request, response, next) => {
    response.render("login", {
        user: request.session.usuario,
        title: "Log In",
        error: request.session.error,
        csrfToken: request.csrfToken(),
        isLoggedIn: request.session.isLoggedIn === true ? true : false
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
    response.render('registrar', {
        user: request.session.usuario,
        title: 'Registra tus datos',
        csrfToken: request.csrfToken(),
        isLoggedIn: request.session.isLoggedIn === true ? true : false
    });
};

exports.postRegister = (request, response, next) => {
    const nuevo_usuario = new Usuario(request.body.nombre, request.body.usuario, request.body.password);
    nuevo_usuario.save()
        .then(() => {
            request.session.isLoggedIn = true;
            request.session.usuario = request.body.usuario;
            response.redirect('/home');
        }).catch(err => console.log(err));

}