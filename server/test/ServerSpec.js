var request = require('supertest');
var express = require('express');
var expect = require('chai').expect;
var app = require('../app');

var connection = require('../connection');

/////////////////////////////////////////////////////
// NOTE: these tests are designed for mongo!
/////////////////////////////////////////////////////

describe("US Crime data visualization", function () {
  // Check if collection crimes exists
  it("Does collection 'crimes' exist", function (done) {
    connection(function (db) {
      db.collection('crimes').find().toArray(function(err, results) {
        expect(results.length).to.not.equal(0);
        done();    
      });
    })
  });
  // Check if document is correctly imported
  it("Should insert 3071 documents in crimes collection", function (done) {

    connection(function (db) {
      db.collection('crimes').find().toArray(function(err, results) {
        expect(results.length).to.equal(3071);
        done();    
      });
    })
  });
});
