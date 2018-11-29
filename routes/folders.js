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
 
//GET SINGLE 

//POST /CREATE

//PUT/UPDATE

//DELETE



module.exports = router;