const chai = require('chai');
const chaiHttp = require('chai-http');
const { servidor } = require('../index');

chai.use(chaiHttp);

describe('Prueba de respuesta del servidor por metodo POST /autos', ()=> {

    it('Comprueba que respuesta del metodo POST entrege como respuesta 200',(done) => {
        chai.request(servidor)
        .post('/autos')
        .send({
            "marca":"citroen",
            "modelo":"citronetta",
            "anio":"1970",
            "puertas":5
        })
        .end((error,respuesta) => {
            chai.expect(respuesta).to.have.status(200);
            done();
        })
    })

});