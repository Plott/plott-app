'use strict';

var app = require('../..');
var request = require('supertest');

describe('Sensor API:', function() {

  describe('GET /api/sensors', function() {
    var sensors;

    beforeEach(function(done) {
      request(app)
        .get('/api/sensors')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          sensors = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      sensors.should.be.instanceOf(Array);
    });

  });

});
