const http = require('http');
const fs = require('fs/promises');
const { v4: uuidv4 } = require('uuid');

const obtenerArchivos = require('./controllers/obtenerArchivos');
const escribirArchivo = require('./controllers/escribirArchivo');
const leerArchivos = require('./controllers/lecturaArchivos');


const servidor = http.createServer(async (req, res) => {
    const { searchParams, pathname } = new URL(req.url, `http://${req.headers.host}`);
    const params = new URLSearchParams(searchParams);


    //Switch dentro de otro, uno controla que la ruta exista y el otro el req.method que se ingrese

    switch (pathname) {
        case '/autos':
            switch (req.method) {
                case 'GET':
                    try {
                        await obtenerArchivos(req, res);
                    } catch (error) {                        
                        console.log(error);
                    }
                    break;
                case 'POST':
                    try {
                        const autos = await obtenerArchivos(req, res);
                        const id = uuidv4();
                        let datosAutos;

                        req.on('data', (data) => {
                            datosAutos = JSON.parse(data);
                        });

                        req.on('end', async () => {
                            autos[id] = datosAutos;
                            await escribirArchivo(autos, res);
                        });
                    } catch (error) {
                        console.log(error);
                    }
                    break;
                case 'PUT':
                    try {
                        const id = params.get('id');
                        const autos = await leerArchivos();
                        let datosParaModificar;

                        req.on('data', (datos) => {
                            datosParaModificar = JSON.parse(datos);
                        });

                        req.on('end', async () => {
                            const autoOriginal = autos[id];
                            const autoActualizado = { ...autoOriginal, ...datosParaModificar };
                            autos[id] = autoActualizado;

                            await fs.writeFile('./datos/autos.txt', JSON.stringify(autos, null, 2));
                            res.write(JSON.stringify(autoActualizado, null, 2));
                            res.end();
                        });
                    } catch (error) {
                        console.log(error);
                    }
                    break;
                case 'DELETE':
                    try {
                        const autos = await leerArchivos();
                        const id = params.get('id');
                        delete autos[id];
                        await escribirArchivo(autos, res);
                    } catch (error) {
                        console.log(error);
                    }
                    break;
                default:
                    res.writeHead(405, { 'Content-Type': 'text/plain' });
                    res.end('Method Not Allowed');
            }
            break;
        default:
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Not Found');
    }
});

servidor.listen(3000, () => {
    console.log('Conectado al puerto 3000 correctamente');
});

module.exports = { servidor };






