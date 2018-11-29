'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const app = require('../server');
const { TEST_MONGODB_URI } = require('../config');

const Note = require('../models/note');

const { notes } = require('../db/seed/notes');

const expect = chai.expect;
chai.use(chaiHttp);


//MOCHA hooks ////

describe('Notes API', function() {

  before(function () {

    console.log('hello');

    return mongoose.connect(TEST_MONGODB_URI)
      .then(() => mongoose.connection.db.dropDatabase());

  });
     

  beforeEach(function () {

    return Note.insertMany(notes);
 
  });
 

  afterEach(function () {

    return mongoose.connection.db.dropDatabase();

  });

  after(function () {

    return mongoose.disconnect();

  });


  it('should return correct number of all the notes', function () {
    
    return chai.request(app)
      .get('/api/notes')
      .then((res) => {

        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');
        expect(res.body).length.to.be.above(0);


      });
 

  });


});