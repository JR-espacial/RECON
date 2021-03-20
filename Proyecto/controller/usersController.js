const Usuario = require('../models/user');

exports.getLogin = (request, response, next) => {
    response.render("login", {
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
                if(request.body.password === rows[0].contrasena){
                    request.session.isLoggedIn = true;
                            request.session.usuario = request.body.usuario;
                            return request.session.save(err => {
                                response.redirect('/home');
                            });
                }
                else{
                    request.session.error = "El usuario y/o contraseña no coinciden";
                    response.redirect('/users/login');
                }
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