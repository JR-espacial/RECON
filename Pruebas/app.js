const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const path = require('path');

app.set('view engine', 'ejs');
app.set('views', 'view');

const loginController = require('./controller/login');

app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/login', loginController.getLogin)

app.listen(8080);