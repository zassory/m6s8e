const chai = require('chai');
const chaiHttp = require('chai-http');
const { servidor } = require('../index');

chai.use(chaiHttp);

describe('Probando respuesta de servidor para metodo DELETE /autos', ()=> {
    it('Comprueba que respuesta de metodo DELETE es codigo 200', (done) => {
        chai.request(servidor)
            .delete('/autos?id=f6a6ddae-43b2-47d6-a37e-8c3bae9ba6ef')
            .end((error, respuesta) => {
                chai.expect(respuesta).to.have.status(200);
                done();
            })            
    })
})