'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const app = require('../server');
const { TEST_MONGODB_URI } = require('../config');

const Folder = require('../models/folder');

const { folders } = require('../db/seed/data');

const expect = chai.expect;
chai.use(chaiHttp);


describe('Folders API', function(){

  before(function () {
 
    return mongoose.connect(TEST_MONGODB_URI)
      .then(() => mongoose.connection.db.dropDatabase());

  });
     
  beforeEach(function () {

    return Folder.insertMany(folders);
 
  });
  
  afterEach(function () {

    return mongoose.connection.db.dropDatabase();

  });

  after(function () {

    return mongoose.disconnect();

  });

  //TEST 1 count folders
  describe('Folder API', function() { 

    console.log('>> NEW TEST 1');
 
    it('should return correct number of all the folders', function () {
      
      return Promise.all([
        Folder.find(),
        chai.request(app).get('/api/folders')
      ])

        .then(([data,res]) => {

          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length(data.length);
 

        });
 

    });
  });








});