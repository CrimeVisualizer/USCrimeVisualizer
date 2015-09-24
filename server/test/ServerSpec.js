var request = require('supertest');
var express = require('express');
var expect = require('chai').expect;
var app = require('../app');

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
  var dbConnection;

  beforeEach(function(done) {
    dbConnection = mysql.createConnection({
      user: "root",
      password: "",
      database: "chat"
    });
    dbConnection.connect();

       var tablename = ""; // TODO: fill this out

    /* Empty the db table before each test so that multiple tests
     * (or repeated runs of the tests) won't screw each other up: */
    dbConnection.query("truncate " + tablename, done);
  });

  afterEach(function() {
    dbConnection.end();
  });

  it("Should insert posted messages to the DB", function(done) {
    // Post the user to the chat server.
    request({ method: "POST",
              uri: "http://127.0.0.1:3000/classes/users",
              json: { username: "Valjean" }
    }, function () {
      // Post a message to the node chat server:
      request({ method: "POST",
              uri: "http://127.0.0.1:3000/classes/messages",
              json: {
                username: "Valjean",
                message: "In mercy's name, three days is all I need.",
                roomname: "Hello"
              }
      }, function () {
        // Now if we look in the database, we should find the
        // posted message there.

        // TODO: You might have to change this test to get all the data from
        // your message table, since this is schema-dependent.
        var queryString = "SELECT * FROM messages";
        var queryArgs = [];

        dbConnection.query(queryString, queryArgs, function(err, results) {
          // Should have one result:
          expect(results.length).to.equal(1);

          // TODO: If you don't have a column named text, change this test.
          expect(results[0].text).to.equal("In mercy's name, three days is all I need.");

          done();
        });
      });
    });
  });

  it("Should output all messages from the DB", function(done) {
    // Let's insert a message into the db
       var tablename = ""; // TODO: fill this out
    // TODO - The exact query string and query args to use
    // here depend on the schema you design, so I'll leave
    // them up to you. */

    dbConnection.query(queryString, queryArgs, function(err) {
      if (err) { throw err; }

      // Now query the Node chat server and see if it returns
      // the message we just inserted:
      request("http://127.0.0.1:3000/classes/messages", function(error, response, body) {
        var messageLog = JSON.parse(body);
        expect(messageLog[0].text).to.equal("Men like you can never change!");
        expect(messageLog[0].roomname).to.equal("main");
        done();
      });
    });
  });
});
