'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const app = require('../server');
const { TEST_MONGODB_URI } = require('../config');

const Note = require('../models/note');
const Folder = require('../models/folder');
const Tag = require('../models/tag');

const { folders, notes, tags } = require('../db/seed/data');

const expect = chai.expect;
chai.use(chaiHttp);


//MOCHA hooks ////
describe('Notes API', function() { 
 
  before(function () {
 
    return mongoose.connect(TEST_MONGODB_URI)
      .then(() => mongoose.connection.db.dropDatabase());

  });
     
  beforeEach(function () {

    return Promise.all([
      Note.insertMany(notes),

      Folder.insertMany(folders),
      Folder.createIndexes(),

      Tag.insertMany(tags),
      Tag.createIndexes()

    ]);
 
  });
  
  afterEach(function () {

    return mongoose.connection.db.dropDatabase();

  });

  after(function () {

    return mongoose.disconnect();

  });



  //TEST 1 GET notes count -- passes
  describe('Notes API', function() { 

    console.log('>> NEW TEST 1');
    
    //It block
    it('should return correct number of all the notes', function () {
      
      //Promise All block
      return Promise.all([
        Note.find(),
        chai.request(app).get('/api/notes')
      ])

        
        //then block
        .then(([data,res]) => {

          //console.log('data >>> ',data);

          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length(data.length);
 

        });
 

    });

    it('Should return correct fields', function(){

      //Promise All block
      return Promise.all([
        Note.find(),
        chai.request(app).get('/api/notes')
      ])

        
        //then block
        .then(([data,res]) => {
          
          //check integrity of res
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length(data.length);

          
 

        });


    });

  });
 
  //Serial test 1: all notes --  
  describe('POST /api/notes', function () {

    //It block 
    it('should create and return a new item when provided valid data', function () {

      const newItem = {
        'title': 'The best article about cats ever!',
        'content': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor...'
      };

      let res;

      //
      // 1) First, call the API
      return chai.request(app)
        .post('/api/notes')
        .send(newItem)
        
        //Then block to check integrity of the response
        .then(function (_res) {

          res = _res;

          //console.log('res.body >>> ',res.body);
 
          expect(res).to.have.status(201);
          expect(res).to.have.header('location');
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.keys('id', 'title', 'content', 'tags','createdAt', 'updatedAt');
          // 2) then call the database
          return Note.findById(res.body.id);
        })

        //Then block to Compare the response to the  results from the seeded dataset
        // 3) then compare the API response to the database results
        .then(data => {
          expect(res.body.id).to.equal(data.id);
          expect(res.body.title).to.equal(data.title);
          expect(res.body.content).to.equal(data.content);
          expect(new Date(res.body.createdAt)).to.eql(data.createdAt);
          expect(new Date(res.body.updatedAt)).to.eql(data.updatedAt);
        });
    });


    // It block to test for an error if title field is empty
    it('should return an error when missing "title" field', function () {
      
      //build a note object with no title...
      const newItem = {
        'content': 'Lorem ipsum dolor sit amet, sed do eiusmod tempor...'
      };

      //Send the new item...
      return chai.request(app)
        .post('/api/notes')
        .send(newItem)

        //Determine that the respones to the new item is an error
        .then(res => {
          expect(res).to.have.status(400);//error is 400
          expect(res).to.be.json;//response is JSON
          expect(res.body).to.be.a('object');//response is an object
          expect(res.body.message).to.equal('Missing `title` in request body');//the message is correct
        });
    });

  });
  
  //Serial test 2: note by id
  describe('GET /api/notes/:id', function () {
    it('should return correct note', function () {
      let data;
      // 1) First, call the database
      return Note.findOne()
        .then(_data => {
          data = _data;
          // 2) then call the API with the ID
          return chai.request(app).get(`/api/notes/${data.id}`);
        })
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;

          expect(res.body).to.be.an('object');
          expect(res.body).to.have.keys('id', 'title', 'content', 'folderId', 'tags', 'createdAt', 'updatedAt');

          // 3) then compare database results to API response
          expect(res.body.id).to.equal(data.id);
          expect(res.body.title).to.equal(data.title);
          expect(res.body.content).to.equal(data.content);
          expect(new Date(res.body.createdAt)).to.eql(data.createdAt);
          expect(new Date(res.body.updatedAt)).to.eql(data.updatedAt);
        });
    });

  });

  //Parallel Request
  describe('GET /api/notes', function () {
    it('should return the correct number of Notes', function () {
    // 1) Call the database **and** the API
    // 2) Wait for both promises to resolve using `Promise.all`
      return Promise.all([
        Note.find(),
        chai.request(app).get('/api/notes')
      ])
      // 3) then compare database results to API response
        .then(([data, res]) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length(data.length);
        });
    });
  });

  //NEW
  // /* ========== TEST GET/READ ALL ITEMS ========== */
  describe('GET /api/notes', function () {

    it('should get all items with correct keys', function(){

       
      return Promise.all([
        Note.find(),
        chai.request(app).get('/api/notes')
      ])
 
        .then(([data,res]) => {

          //console.log('data >>> ',data);

           

          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length(data.length);

          //Check for title
           


          //check for proper keys
          res.body.forEach(function (note){
 
            expect(note).to.have.keys('id', 'title', 'content', 'folderId', 'tags', 'createdAt', 'updatedAt');
            expect(note.title).to.be.a('string');
            expect(note.tags).to.be.a('array');
            expect(note.folderId).to.have.keys('name', 'createdAt', 'updatedAt', 'id');

          });



          //console.log('res.body >>> ',res.body);

          //expect(res.body).to.equal(data);
          //expect(res.body).to.have.keys('id', 'title', 'content', 'folderId', 'tags', 'createdAt', 'updatedAt');

          

        });

        

    });

  });

  /* ========== GET/READ A SINGLE ITEM BY ID ========== */


  /* ========== PUT/UPDATE A SINGLE ITEM BY ID ========== */


  /* ========== DELETE/REMOVE A SINGLE ITEM BY ID========== */



});
 


 