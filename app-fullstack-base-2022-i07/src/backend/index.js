//=======[ Settings, Imports & Data ]==========================================

var PORT    = 3000;

const cors = require('cors');

var express = require('express');
var app = express();
var pool = require('./mysql-connector');

const routerDispositivo = require('./routes/dispositivo')
const routerMedicion = require('./routes/medicion')
const routerRegistro = require('./routes/registro')

var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

const myLogger = function(req, res, next) {
    console.log(new Date())
    next()
}

//const authenticator = function(req, res, next) {
    // si el usuario tiene permiso
    //next()
    // si el usuario no tiene permiso
    //res.send('No tenes permiso para acceder al recurso').status(401)
//}

app.use(myLogger)
// to parse application/json
app.use(express.json()); 
// to serve static files
app.use(express.static('/home/node/app/static/'));
// to enable cors
app.use(cors(corsOptions));

app.use('/dispositivo', routerDispositivo)
app.use('/medicion', routerMedicion)
app.use('/registro', routerRegistro)


//=======[ Main module code ]==================================================

app.listen(PORT, function(req, res) {
    console.log("NodeJS API running correctly");
});

//=======[ End of file ]=======================================================