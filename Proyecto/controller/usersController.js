exports.getLogin = (request, response, next) => {
    response.render("login", {
        isLoggedIn: request.session.isLoggedIn === true ? true : false
    });
};

exports.postLogin = (request, response, next) => {
    request.session.isLoggedIn = true;
    request.session.usuario = request.body.usuario;
    response.redirect('/home');
};

exports.getLogout = (request, response, next) => {
    request.session.destroy(() => {
        console.log('Logout');
        response.redirect('/users/login');
    });
}