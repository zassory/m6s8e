const { response , request } = require('express');
const http = require('http');
const fs = require('fs/promises');
const { v4: uuidv4 } = require('uuid');

const leerArchivos = require('./controllers/lecturaArchivos');
const obtenerArchivos = require('./controllers/obtenerArchivos');
const escribirArchivo = require('./controllers/escribirArchivo');

const servidor = http.createServer( async(req = request, res=response) => {
    const { searchParams , pathname } = new URL(req.url,`http://${req.headers.host}`);
    const params = new URLSearchParams(searchParams);    


    if(pathname === '/autos' && req.method === 'GET'){
        try{                                    
            await obtenerArchivos(req,res);
        }catch(error){
            console.log(error);
        }
    }
    if(pathname === '/autos' && req.method === 'POST'){
        try{            
            //const autos = await leerArchivos();
            const autos = await obtenerArchivos(req,res);

            const id = uuidv4();

            let datosAutos;

            req.on('data', (data) => {
                  datosAutos = JSON.parse(data);
             });
            req.on('end', async() => {
                autos[id] = datosAutos;                
                await escribirArchivo(autos,res);
            });
        }catch(error){
            console.log(error);
        }

    }
    if(pathname === '/autos' && req.method === 'PUT'){
        try{
            const id = params.get('id');            
            const autos = await leerArchivos();

            let datosParaModificar;

            //Por cada dato en el callback (param)
            req.on('data',(datos) => {
                datosParaModificar = JSON.parse(datos);
            })
            req.on('end', async() => {
                const autoOriginal = autos[id];
                const autoActualizado = {...autoOriginal, ...datosParaModificar};//Estudiar esto

                autos[id] = autoActualizado;

                await fs.writeFile('./datos/autos.txt', JSON.stringify(autos,null,2));
                res.write(JSON.stringify(autoActualizado,null,2));
                res.end();
            });
        }catch(error){
            console.log(error);
        }
    }
    if(pathname === '/autos' && req.method === 'DELETE'){
        try{            
            const autos = await leerArchivos();            
            const id = params.get('id');
            delete autos[id];            
            await escribirArchivo(autos,res);

            // await res.write(JSON.stringify(autos, null , 2));
            // await res.end();
        }catch(error){
            console.log(error);
        }
    }   
})
servidor.listen(3000, ()=> {
    console.log('Conectado al puerto 3000 correctamente');
});

module.exports = { servidor };