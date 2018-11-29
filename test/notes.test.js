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



  //TEST 1 GET notes count 
  describe('Notes API', function() { 

    console.log('>> NEW TEST 1');
 
    it('should return correct number of all the notes', function () {
      
      return Promise.all([
        Note.find(),
        chai.request(app).get('/api/notes')
      ])

        .then(([data,res]) => {

          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length(data.length);
 

        });
 

    });
  });


  it('should return a list with the correct right fields', function () {
    return Promise.all([
      Note.find().sort({ updatedAt: 'desc' }),
      chai.request(app).get('/api/notes')
    ])
      .then(([data, res]) => { 
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');
        expect(res.body).to.have.length(data.length);
        res.body.forEach(function (item, i) { 
          console.log('>>> ',i);
          expect(item).to.be.a('object');
          expect(item).to.include.all.keys('id', 'title', 'createdAt', 'updatedAt');
          expect(item.id).to.equal(data[i].id);
          expect(item.title).to.equal(data[i].title);
          expect(item.content).to.equal(data[i].content);
          expect(new Date(item.createdAt)).to.deep.equal(data[i].createdAt);
          expect(new Date(item.updatedAt)).to.deep.equal(data[i].updatedAt);
        });
      });
  });





  // //TEST 2 PUT post a new note
  // describe('POST /api/notes', function () {
  //   it('should create and return a new item when provided valid data', function () {
  //     const newItem = {
  //       'title': 'The best article about cats ever!',
  //       'content': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor...'
  //     };

  //     console.log('>> TEST 2');

  //     let res;
  //     // 1) First, call the API
  //     return chai.request(app)
  //       .post('/api/notes')
  //       .send(newItem)
  //       .then(function (_res) {
  //         res = _res;
  //         expect(res).to.have.status(201);
  //         expect(res).to.have.header('location');
  //         expect(res).to.be.json;
  //         expect(res.body).to.be.a('object');
  //         expect(res.body).to.have.keys('id', 'title', 'content', 'createdAt', 'updatedAt');
  //         // 2) then call the database
  //         return Note.findById(res.body.id);
  //       })
  //     // 3) then compare the API response to the database results
  //       .then(data => {
  //         expect(res.body.id).to.equal(data.id);
  //         expect(res.body.title).to.equal(data.title);
  //         expect(res.body.content).to.equal(data.content);
  //         expect(new Date(res.body.createdAt)).to.eql(data.createdAt);
  //         expect(new Date(res.body.updatedAt)).to.eql(data.updatedAt);
  //       });
  //   });
  // });

  // //TEST 3 GET a note with a certain ID
  // describe('GET /api/notes/:id', function () {
  //   it('should return correct note', function () {

  //     console.log('>> TEST 3');

  //     let data;
  //     // 1) First, call the database
  //     return Note.findOne()
  //       .then(_data => {
  //         data = _data;
  //         // 2) then call the API with the ID
  //         return chai.request(app).get(`/api/notes/${data.id}`);
  //       })
  //       .then((res) => {
  //         expect(res).to.have.status(200);
  //         expect(res).to.be.json;

  //         expect(res.body).to.be.an('object');
  //         expect(res.body).to.have.keys('id', 'title', 'content', 'createdAt', 'updatedAt');

  //         // 3) then compare database results to API response
  //         expect(res.body.id).to.equal(data.id);
  //         expect(res.body.title).to.equal(data.title);
  //         expect(res.body.content).to.equal(data.content);
  //         expect(new Date(res.body.createdAt)).to.eql(data.createdAt);
  //         expect(new Date(res.body.updatedAt)).to.eql(data.updatedAt);
  //       });
  //   });
  // });

  // //TEST 4 GET all notes and compare
  // describe('GET /api/notes', function () {

  //   console.log('>> TEST 4');


  //   // 1) Call the database **and** the API
  //   // 2) Wait for both promises to resolve using `Promise.all`
  //   return Promise.all([
  //     Note.find(),
  //     chai.request(app).get('/api/notes')
  //   ])
  //   // 3) then compare database results to API response
  //     .then(([data, res]) => {
  //       expect(res).to.have.status(200);
  //       expect(res).to.be.json;
  //       expect(res.body).to.be.a('array');
  //       expect(res.body).to.have.length(data.length);
  //     });
  // });


});
 


