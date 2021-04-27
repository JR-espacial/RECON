const express = require('express')
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const path = require('path');
//Para acceder a los recursos de la carpeta public
app.use(express.static(path.join(__dirname, 'public')));
//Para acceder a los recursos de la carpeta uploads
app.use(express.static(path.join(__dirname, 'uploads')));

app.set('view engine', 'ejs');
app.set('views', 'view');

const multer = require('multer');
//fileStorage: Es nuestra constante de configuración para manejar el almacenamiento
const fileStorage = multer.diskStorage({
    destination: (request, file, callback) => {
        //'uploads': Es el directorio del servidor donde se subirán los archivos 
        callback(null, 'uploads');
    },
    filename: (request, file, callback) => {
        //aquí configuramos el nombre que queremos que tenga el archivo en el servidor, 
        //para que no haya problema si se suben 2 archivos con el mismo nombre concatenamos el timestamp
        callback(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
    },
});
//En el registro, pasamos la constante de configuración y
//usamos single porque es un sólo archivo el que vamos a subir, 
//pero hay diferentes opciones si se quieren subir varios archivos. 
//'archivo' es el nombre del input tipo file de la forma
app.use(multer(
    { storage: fileStorage }
    //{ dest: 'uploads' }
    ).single('imagen'));



const session = require('express-session');
app.use(session({
    secret: 'ikjdklfmañsldj', 
    resave: false,
    saveUninitialized: false,
}));

const csrf = require('csurf');
const csrfProtection = csrf();
app.use(csrfProtection);

const users = require('./routes/users');
const home = require('./routes/home');
const proyectos = require('./routes/proyectos');

app.use('/proyectos', proyectos);
app.use('/users', users);
app.use('/home', home);
app.use("/",(request, response,next) => {   
     response.status(404).send('<html><head><meta charset="UTF-8"><title>Page not found</title></head><body><h1>Error 404</h1></body></html>')
    //response.status(404).redirect('/home');
});

app.listen(8080);