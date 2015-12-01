'use strict';

var app = require('../..');
var request = require('supertest');

describe('Tile API:', function() {

  describe('GET /api/tiles', function() {
    var tiles;

    beforeEach(function(done) {
      request(app)
        .get('/api/tiles')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          tiles = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      tiles.should.be.instanceOf(Array);
    });

  });

});
