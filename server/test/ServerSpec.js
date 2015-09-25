var request = require('supertest');
var express = require('express');
var expect = require('chai').expect;
var mongoose = require('mongoose');
var app = require('../app');
var Crimes = require('../model/crimeSchema');
var db = require('../db');

/////////////////////////////////////////////////////
// NOTE: these tests are designed for mongo!
/////////////////////////////////////////////////////
// check if mongo db USCrime exists

// check if collection crimes exists

// check if its has all the fields we want 

// check if total rows in collection is === 3079


// var request = require("request"); // You might need to npm install the request module!
describe("US Crime data visualization", function() {
  it("Does collection 'crimes' exist", function(done) {
    Crimes.findOne({}, function(err, result) {
      expect(result).to.not.equal(null);
      done();
    });

  });

  it("Should insert 3071 documents in crimes collection", function(done) {

    Crimes.find({}, function(err, result) {
      expect(result.length).to.equal(3071);
      done();
    });
  });
});
