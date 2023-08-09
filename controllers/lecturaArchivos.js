const fs = require('fs/promises');

const leerArchivos = async() => {
    const archivoOriginal = await fs.readFile('./datos/autos.txt');
    const datosOriginales = await JSON.parse(archivoOriginal);
    
    return datosOriginales;
}

module.exports = leerArchivos;