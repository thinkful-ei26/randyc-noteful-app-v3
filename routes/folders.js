'use strict';

const express = require('express');
const mongoose = require('mongoose');

const Folder = require('../models/folder');

const router = express.Router();

//GET ALL FOLDERS
router.get('/',(req,res,next) => {

  Folder.find()
    .sort({ name: 'asc'})
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });
 
});
 
//GET SINGLE FOLDER BY ID
router.get('/:id',(req,res,next) => {

  const { id } = req.params;

  /***** Never trust users - validate input *****/
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('Geez! the id that you entered is not valid');
    err.status = 400;
    return next(err);
  }
 
  Folder.findById(id)
    .then(result => {
      
      if(result){
        //const err = new Error('All good!');
        //err.status = 200;//all good
        
        res.status(201);//test
        res.json(result);
        
      }
      else{
         
        next();}

    })
    .catch( err => next(err));

   
});

//POST /CREATE
router.post('/',(req,res,next) => {

  const { name } = req.body;

  const newFolder = { name };

  /***** Never trust users - validate input *****/
  if (!name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }

  Folder.create(newFolder)
    .then(result => {
      res.location(`${req.originalUrl}/${result.id}`)
        .status(201)
        .json(result);
    })
    .catch(err => {
      if(err.code === 11000) {
        err = new Error('The folder name already exists');
        err.status = 400;
      }
      next(err);
    });
    
});

//PUT/UPDATE
router.put('/:id',(req,res,next) => {

  const { id } = req.params;
  const { name } = req.body;

  /***** Never trust users - validate input *****/
  if (!name) {
    const err = new Error('You must have a `name` in request body');
    err.status = 400;
    return next(err);
  }

  /***** Never trust users - validate input *****/
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  const updatedFolder = { name };

  Folder.findByIdAndUpdate(id,updatedFolder, { new: true })
    .then(result => res.json(result))
    .catch( err => next(err));
 

});


//DELETE
router.delete('/:id',(req,res,next) => {

  const { id } = req.params;

  /***** Never trust users - validate input *****/
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  
  Folder.findByIdAndRemove(id)
    .then(() => {
      res.sendStatus(204).end(); 
    })
    .catch(err => next(err));


  //need to get the folder id off of afffected note(s)



});
 

module.exports = router; 
