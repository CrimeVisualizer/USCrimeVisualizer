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
  it("Should return 3 months of data", function (done) {
    var month = 7;
    var year = 2015;
    var rollover = 0;
    if(month > 10) {
      rollover = 1;
    }
    var search = [
      // cray regex stuff
      { Date: new RegExp('.*' + month + '\/.*\/' + year)},
      { Date: new RegExp('.*' + (month + 1)%12 + '\/.*\/' + (+year+rollover))},
      { Date: new RegExp('.*' + (month + 2)%12 + '\/.*\/' + (+year+rollover))}
    ];

    connection(function (db) {
      // here we use search varable to correctly query db for 3 months
      db.collection('crimes').find({$or: search}).toArray(function(err, results) {
        expect(results.length).to.not.equal(0);
        done();    
      });
    });
  });
});
