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

describe("US Crime data visualization", function () {
  // Check if collection crimes exists
  it("Does collection 'crimes' exist", function (done) {
    Crimes.findOne({}, function(err, result) {
      expect(result).to.not.equal(null);
      done();
    });

  });
  // Check if document is correctly imported
  it("Should insert 3071 documents in crimes collection", function (done) {

    Crimes.find({}, function (err, result) {
      expect(result.length).to.equal(3071);
      done();
    });
  });
});
