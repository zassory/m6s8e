const { response } = require('express');
const fs = require('fs/promises');

const escribirArchivo = async(autos , res = response) => {
    await fs.writeFile('./datos/autos.txt' , JSON.stringify(autos,null,2));
    res.statusCode = 200;
    res.write("Auto agregado satisfactoriamente");
    res.end();
}

module.exports = escribirArchivo;