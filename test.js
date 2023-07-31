const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('./index.js');

chai.use(chaiHttp);
const expect = chai.expect;

describe('Anime Server', () => {
  it('Debería retornar el mensaje de bienvenida en la ruta raíz', (done) => {
    chai
      .request(server)
      .get('/')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.text).to.equal('Bienvenido a Anime Server');
        done();
      });
  });

  it('Debería retornar toda la data de animo en /list', (done) => {
    chai
      .request(server)
      .get('/list')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.deep.equal(require('./anime.json'));
        done();
      });
  });

  it('Debería retornar un animé específico por id', (done) => {
    const animeId = 1;
    chai
      .request(server)
      .get(`/anime?id=${animeId}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.deep.equal(require('./anime.json')[animeId.toString()]);
        done();
      });
  });

  it('Debería retornar un animé específico por nombre', (done) => {
    const animeName = 'Akira';
    chai
      .request(server)
      .get(`/anime?name=${encodeURIComponent(animeName)}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.deep.equal(
          Object.values(require('./anime.json')).find(
            (anime) => anime.nombre.toLowerCase() === animeName.toLowerCase()
          )
        );
        done();
      });
  });

  it('Debería manejar las rutas no encontradas con 404 no encontrado', (done) => {
    chai
      .request(server)
      .get('/invalid')
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.text).to.equal('404 No encontrado');
        done();
      });
  });
});
