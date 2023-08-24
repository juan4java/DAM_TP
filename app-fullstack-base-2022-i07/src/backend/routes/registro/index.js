const express = require('express')

const routerRegistro = express.Router()

var pool = require('../../mysql-connector');
const routerCommon = require('../common');

routerRegistro.get('/:electrovalvula_id', function(req, res) {

    var sql = `SELECT * FROM Log_Riegos WHERE electrovalvulaId ='${req.params.electrovalvula_id}' ORDER BY fecha DESC`;
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

routerRegistro.get('/last/:electrovalvula_id', function(req, res) {

    var sql = `SELECT * FROM Log_Riegos WHERE electrovalvulaId ='${req.params.electrovalvula_id}' ORDER BY fecha DESC LIMIT 1`;
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

routerRegistro.put('/', function(req, res) {

    if(req.body.electrovalvulaId == null || req.body.apertura == null || req.body.fecha == null){
        sendErrorResponse(res);
        return
    }
    
    if(!isValidElectrovalvulaId(req.body.electrovalvulaId)||
         !isValidDate(req.body.fecha)||
         !isValidValue(req.body.apertura)){
        sendErrorResponse(res);
        return
    }

    var sql = `INSERT INTO Log_Riegos ( apertura, fecha, electrovalvulaId) 
        VALUES ('${req.body.apertura}', '${req.body.fecha}', '${req.body.electrovalvulaId}')`; 
    
    var responseAsJson
    pool.query(sql, function(err, result, fields) {
        console.log(result)
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

function isValidElectrovalvulaId(id){
    if(id.length > 11){
        console.log("Registro invalid for id " , id)
        return false
    }

    var pattern = /^\d+$/;
    let result =  pattern.test(id);
    if(result){
        return true;
    } else {
        console.log("Registro invalid for id " , id)
        return false
    }
}

function isValidDate(fecha){
    if(fecha.length == 19){
        return true
    }

    console.log("Registro invalid for date " , fecha)
    return false
}

function isValidValue(valor){
    if(valor == 1 || valor == 0){
         return true;
    } else {
        console.log("Registro invalid for apertura " , valor)
        return false
    }

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


module.exports = routerRegistro