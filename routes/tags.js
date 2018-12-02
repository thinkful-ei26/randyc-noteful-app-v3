'use strict';
 
const express = require ('express');
const mongoose = require('mongoose');
const Tag = require('../models/tag');
const Note = require('../models/note');
const router = express.Router();



//GET all /tags
router.get('/',(req,res,next) => {

  Tag.find()
    .sort({ name: 'asc'})
    .then(results => res.json(results))
    .catch(err => next(err));
 
});

//GET /tags by id
router.get('/:id',(req,res,next) => {

  const { id } = req.params;

  /***** Never trust users - validate input *****/
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('Geez! the id that you entered is not valid');
    err.status = 400;
    return next(err);
  }

  Tag.findById(id)
    .then(result => {

      if(result){
        const err = new Error('All good!');
        err.status = 200;//all good
        res.json(result);

      }
      else{

        next();
      
      }
    })
    .catch( err => next(err));
   
});


//POST /tags to create a new tag
router.post('/', (req,res,next) =>{

  const { name } = req.body;

  const newTag = { name };

  /***** Never trust users - validate input *****/
  if (!name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
 
  }

  Tag.create(newTag)
    .then(result => {
      res.location(`${req.originalUrl}/${result.id}`)
        .status(201)
        .json(result);
    }) 
    .catch(err => {
      if(err.code === 11000) {
        err = new Error('That tag name already exists');
        err.status = 400;
      }
      next(err);
    }); 



});

//PUT /tags by id to update a tag
router.put('/:id', (req,res,next) => {

  const { id } = req.params;
  const { name } = req.body;

  console.log('>>>>> id: ' + id +' >>>>> name: ' + name);

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
 
   
  const updateTag = { name };

  Tag.findByIdAndUpdate(id,updateTag, {new: true, upsert: true})
    .then (result => res.json(result))
    .catch( err => next(err));


});

//DELETE /tags by id
router.delete('/:id',(req,res,next) =>{

  const { id } = req.params;

  /***** Never trust users - validate input *****/
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  
  Note.updateMany(
    {tags: id },{ $pull:{ tags: id }},
    { multi: true }
  )
    .then(() => {

      Tag.findByIdAndRemove(id)
        .then(() => {
          res.sendStatus(204).end();
        })
        .catch(err => next(err));
 
    })
    .catch(err => next(err));
 
});



module.exports = router;