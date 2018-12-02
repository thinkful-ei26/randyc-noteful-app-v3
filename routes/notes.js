'use strict';

const express = require('express');
const mongoose = require('mongoose');
const Note = require('../models/note');

const router = express.Router();

/* ========== GET/READ ALL ITEMS ========== */

router.get('/', (req, res, next) => {

  const { searchTerm, folderId, tags } = req.query;
  let filter = {};

  //if there is a title input then set filter to be the input searchTerm
  if (searchTerm) {
    filter.title = { $regex: searchTerm, $options: 'i' };

    // Mini-Challenge: Search both `title` and `content`
    // const re = new RegExp(searchTerm, 'i');
    // filter.$or = [{ 'title': re }, { 'content': re }];
  }


  //if there is a folder Id input then set filter to be the input folderId
  if (folderId) {
 
    filter.folderId = folderId;
 
  }

  //if there is a tag Id input then set filter to be the input tagId
  if (tags) {
 
    filter.tag.id = tags;
 
  }
 

  Note.find(filter)
    .populate('folderId')
    .populate('tags')
    .sort({ updatedAt: 'desc' })
    .then(results => res.json(results))
    .catch(err => next(err));
});

/* ========== GET/READ A SINGLE ITEM ========== */
router.get('/:id', (req, res, next) => {

  // const noteId = req.params.id;
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }


  //is this a note id or a folder id?

  //find note
  Note.findById(id)
    .populate('folderId')
    .populate('tags')
    .then(result => {
      if (result){
        res.json(result);
      } else { 
        next();
      }
    })

    .catch( err => {
      next(err);
    });
    
});
  

/* ========== POST/CREATE AN ITEM ========== */
router.post('/', (req, res, next) => {

  const { title, content, folderId, tags } = req.body;

  const newNote = { title, content, folderId, tags };
 

  /***** Never trust users - validate input *****/
  if (!title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
 
  }

  //Need to check all ids in the tags array!
  if(tags){
    tags.forEach(function (tag) {
      if (tag && !mongoose.Types.ObjectId.isValid(tag)) {
        const err = new Error('The `tagId` is not valid');
        err.status = 400;
        return next(err);
      }
    });
  }

  if (folderId && !mongoose.Types.ObjectId.isValid(folderId)) {
    const err = new Error('The `folderId` is not valid');
    err.status = 400;
    return next(err);
  }
  

  Note.create(newNote)
    .then(result => {
      res.location(`${req.originalUrl}/${result.id}`)
        .status(201)
        .json(result);
    })
    .catch(err => next(err));

});

/* ========== PUT/UPDATE A SINGLE ITEM ========== */
router.put('/:id', (req, res, next) => {

  // const noteId = req.params.id;
  const { id } = req.params;
  const { title, content, folderId, tags } = req.body; //updateable fields

  /***** Never trust users - validate input *****/
  //Check title
  if (!title) { 
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
 
  }

  //check note id

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  //check folder id
  if (folderId && !mongoose.Types.ObjectId.isValid(folderId)) {
    const err = new Error('The `folderId` is not valid');
    err.status = 400;
    return next(err);
  }

  //Need to check all ids in the tags array!
  if(tags){ 
    tags.forEach(function (tag) {
      if (tag && !mongoose.Types.ObjectId.isValid(tag)) {
        const err = new Error('The `tagId` is not valid');
        err.status = 400;
        return next(err);
      }
    });
  }
   
 
  const updatedNote = { title, content, folderId, tags };

  if(folderId === ''){

    delete updatedNote.folderId;

    updatedNote.$unset = { folderId:'' };

  }

 
  Note.findByIdAndUpdate(id, updatedNote, { new: true })
    .then(result => res.json(result))
    .catch( err => next(err));

   

});

/* ========== DELETE/REMOVE A SINGLE ITEM ========== */
router.delete('/:id', (req, res, next) => {

  // const noteId = req.params.id;
  const { id } = req.params;

  /***** Never trust users - validate input *****/
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  Note.findByIdAndRemove(id)
    .then(() => {
      res.sendStatus(204).end(); 
    })
    .catch(err => next(err));
});

module.exports = router;