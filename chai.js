const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const { expect } = chai;

chai.use(chaiHttp);

describe('Stock Price Checker', function() {

  it('should return the price of a single stock', function(done) {
    chai.request(server)
      .get('/api/stock-prices')
      .query({ stock: 'AAPL' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('price');
        expect(res.body).to.have.property('stock');
        done();
      });
  });

  it('should allow a user to like a stock', function(done) {
    chai.request(server)
      .get('/api/stock-prices')
      .query({ stock: 'AAPL', like: 'true' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('likes').that.is.a('number');
        done();
      });
  });

  it('should prevent the same IP from liking a stock more than once', function(done) {
    chai.request(server)
      .get('/api/stock-prices')
      .query({ stock: 'AAPL', like: 'true' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        const initialLikes = res.body.likes;
        
        // Try liking again from the same "IP"
        chai.request(server)
          .get('/api/stock-prices')
          .query({ stock: 'AAPL', like: 'true' })
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body.likes).to.equal(initial
