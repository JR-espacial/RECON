const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const path = require('path');

app.set('view engine', 'ejs');
app.set('views', 'view');

const loginController = require('./controller/login');
const homeController = require('./controller/homeController');
const proyectos = require('./routes/proyectos');

app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/proyectos', proyectos);

app.use('/home', homeController.getHome);

app.use('/login', loginController.getLogin);



app.use("/",(request, response,next) => {   
    response.status(404).send('<html><head><meta charset="UTF-8"><title>Page not found</title></head><body><h1>Error 404</h1></body></html>')
});

app.listen(3000);