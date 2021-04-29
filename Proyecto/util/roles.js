function authRole(idRole){
    return(request, response, next) => {
        if(request.session.idRol !== idRole){
            response.status(401).redirect('/home/acces-denied')
        }
        next();
    }  
}

module.exports = {
    authRole
}