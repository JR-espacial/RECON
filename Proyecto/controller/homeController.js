exports.getHome = (request, response) => {
    const alerta= request.session.alerta
    request.session.alerta = ""
    request.session.last = '/home';
    response.render('home', { 
        title: "Home",
        alerta : alerta
    });
}