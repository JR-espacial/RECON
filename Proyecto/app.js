const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const isAuth = require('./util/is_Auth');

app.set('view engine', 'ejs');
app.set('views', 'view');

const users = require('./routes/users');
const homeController = require('./controller/homeController');
const proyectos = require('./routes/proyectos');

app.use(bodyParser.urlencoded({extended: false}));

app.use(session({
    secret: 'ikjdklfmañsldj', 
    resave: false,
    saveUninitialized: false,
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/proyectos', proyectos);

app.use('/users', users);

app.use('/home', isAuth, homeController.getHome);


app.use("/",(request, response,next) => {   
    response.status(404).send('<html><head><meta charset="UTF-8"><title>Page not found</title></head><body><h1>Error 404</h1></body></html>')
});

app.listen(3000);