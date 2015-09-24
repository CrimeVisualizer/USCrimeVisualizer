var request = require('supertest');
var express = require('express');
var expect = require('chai').expect;
var app = require('../app');

var db = require('../db');

/////////////////////////////////////////////////////
// NOTE: these tests are designed for mongo!
/////////////////////////////////////////////////////

