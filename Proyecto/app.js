const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const isAuth = require('./util/is_Auth');
const csrf = require('csurf');
const csrfProtection = csrf();

app.set('view engine', 'ejs');
app.set('views', 'view');

const users = require('./routes/users');
const home = require('./routes/home');
const proyectos = require('./routes/proyectos');

app.use(bodyParser.urlencoded({extended: false}));

app.use(session({
    secret: 'ikjdklfmañsldj', 
    resave: false,
    saveUninitialized: false,
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use(csrfProtection); 

app.use('/proyectos', proyectos);

app.use('/users', users);

app.use('/home', home);


app.use("/",(request, response,next) => {   
    response.status(404).send('<html><head><meta charset="UTF-8"><title>Page not found</title></head><body><h1>Error 404</h1></body></html>')
});

app.listen(3000);