const express = require('express')
const routerMedicion = express.Router()

var pool = require('../../mysql-connector');
const routerCommon = require('../common');

routerMedicion.get('/list', function(req, res) {
    
    var sql = `SELECT * FROM Mediciones`;
    var responseAsJson

    pool.query(sql, function (err, result) {
      
        if (err) {
            responseAsJson = handleError(err, res);
        } else {
            responseAsJson = result;
            res.status(200)
        }
        res.send((JSON.stringify(responseAsJson)));
    }); 
})

routerMedicion.get('/:dispositivo_id', function(req, res) {

    if(req.params.dispositivo_id == null){
        sendErrorResponse(res);
        return
    }
    
    if(!isValidDeviceId(req.params.dispositivo_id)){
        sendErrorResponse(res);
        return
    }

    var sql = `SELECT * FROM Mediciones WHERE dispositivoId = ${req.params.dispositivo_id} ORDER BY fecha DESC`;
    var responseAsJson

    pool.query(sql, function (err, result) {
      
        if (err) {
            responseAsJson = handleError(err, res);
        } else {
            responseAsJson = result;
            res.status(200)
        }
        res.send((JSON.stringify(responseAsJson)));
    });
})

routerMedicion.get('/last/:dispositivo_id', function(req, res) {

    if(req.params.dispositivo_id == null){
        sendErrorResponse(res);
        return
    }
    
    if(!isValidDeviceId(req.params.dispositivo_id)){
        sendErrorResponse(res);
        return
    }

    var sql = `SELECT * FROM Mediciones WHERE dispositivoId = ${req.params.dispositivo_id} ORDER BY fecha DESC LIMIT 1`;
    var responseAsJson

    pool.query(sql, function (err, result) {
      
        if (err) {
            responseAsJson = handleError(err, res);
        } else {
            responseAsJson = result[0];
            res.status(200)
        }
        res.send((JSON.stringify(responseAsJson)));
    });
})

routerMedicion.put('/', function(req, res) {
    
    if(req.body.dispositivoId == null || req.body.valor == null || req.body.fecha == null){
        sendErrorResponse(res);
        return
    }
    
    if(!isValidDeviceId(req.body.dispositivoId)||
         !isValidDate(req.body.fecha)||
         !isValidValue(req.body.valor)){
        sendErrorResponse(res);
        return
    }

    var sql = `INSERT INTO Mediciones (valor, fecha , dispositivoId) 
        VALUES ('${req.body.valor}', '${req.body.fecha}', '${req.body.dispositivoId}')`;
    var responseAsJson

    pool.query(sql, function (err, result) {
      
        if (err) {
            responseAsJson = handleError(err, res);
        } else {
            var response = `{"message":"Registro insertado", "id":${result.insertId}}`
            responseAsJson = JSON.parse(response)
            res.status(200)
        }
        res.send(result);
    }); 
})


/**
 * Establece mensaje y status de response
 * @param {*} err 
 * @param {*} res 
 * @returns 
 */
function handleError(err, res) {
    console.error(`Error while connect to DB:  ${err.stack}`);
    responseAsJson = JSON.parse(`{"message":"Fallo al obtener los datos"}`);
    res.status(503);
    return responseAsJson;
}


/**
 * Envia respuesta y mensaje ante un error
 * @param {*} res 
 */
function sendErrorResponse(res) {
    responseAsJson = JSON.parse(`{"message":"Parametros no validos , o incompletos"}`);
    res.status(400);
    res.send((JSON.stringify(responseAsJson)));
}


/**
 * Valida que un id sea numerico, posea un largo determinado maximo
 */
function isValidDeviceId(id){
    if(id.length > 11){
        console.log("Medicion invalid for id " , id)
        return false
    }

    var pattern = /^\d+$/;
    let result =  pattern.test(id);
    if(result){
        return true;
    } else {
        console.log("Medicion invalid for id " , id)
        return false
    }
}

function isValidDate(fecha){
    if(fecha.length == 19){
        return true
    }

    console.log("Medicion invalid for date " , fecha)
    return false
}

function isValidValue(valor){
    if(valor > 100){
        console.log("Medicion invalid for value " , valor)
        return false
    }

    var pattern = /^\d+$/;
    let result =  pattern.test(valor);
    if(result){
        return true;
    } else {
        console.log("Medicion invalid for value " , valor)
        return false
    }
}
module.exports = routerMedicion;