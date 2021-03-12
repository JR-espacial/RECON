const Usuario = require('../models/user');

exports.getLogin = (request, response, next) => {
    response.render("login", {
        isLoggedIn: request.session.isLoggedIn === true ? true : false
    });
};

exports.postLogin = (request, response, next) => {

    request.session.error = "";
    const username = request.body.usuario;
    console.log(username);
    Usuario.fetchOne(username)
        .then(([rows, fieldData]) => {
            if (rows.length < 1) {
                request.session.error = "El usuario y/o contraseña no coinciden";
                response.redirect('/home');
            } else {
                if(request.body.password === rows[0].contrasena){
                    request.session.isLoggedIn = true;
                            request.session.usuario = request.body.usuario;
                            return request.session.save(err => {
                                response.redirect('/personajes');
                            });
                }
                else{
                    request.session.error = "El usuario y/o contraseña no coinciden";
                    response.redirect('/home');
                }
            }
        })
        .catch(err => {
            console.log(err);
        });
};

exports.getLogout = (request, response, next) => {
    request.session.destroy(() => {
        console.log('Logout');
        response.redirect('/users/login');
    });
}