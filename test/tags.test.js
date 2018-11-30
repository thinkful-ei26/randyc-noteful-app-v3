'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const app = require('../server');
const { TEST_MONGODB_URI } = require('../config');

const Tag = require('../models/tag');

const { tags } = require('../db/seed/data');

const expect = chai.expect;
chai.use(chaiHttp);


// ADD THESE


describe('Tags API', function(){

  before(function () {
   
    return mongoose.connect(TEST_MONGODB_URI)
      .then(() => mongoose.connection.db.dropDatabase());
  
  });
       
  beforeEach(function () {
  
    return Tag.insertMany(tags);
   
  });
    
  afterEach(function () {
  
    return mongoose.connection.db.dropDatabase();
  
  });
  
  after(function () {
  
    return mongoose.disconnect();
  
  });
  
  // ADD THESE
  
  //TEST 1 count tags
  describe('Tags API', function() { 
  
    console.log('>> NEW TAGS TEST 1');
   
    it('should return correct number of all the tags', function () {
        
      return Promise.all([
        Tag.find(),
        chai.request(app).get('/api/tags')
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