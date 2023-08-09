const { response , request } = require('express');

const leerArchivos = require('../controllers/lecturaArchivos');

const obtenerArchivos = async(req,res)=> {
    const autos = await leerArchivos();
    res.statusCode = 200;
    res.write(JSON.stringify(autos,null,2));
    res.end();
    return autos;
}

module.exports = obtenerArchivos;