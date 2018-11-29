'use strict';

const mongoose = require('mongoose');

const folderSchema = new mongoose.Schema
({

  name: {
    type: String,
    required: true,
    unique: true
  }
 
});


folderSchema.set('timestamps', true);

folderSchema.set('toJSON', {
  virtuals: true,     // include built-in virtual `id`
  transform: (doc, ret) => {
    delete result._id;
    delete result.__v;
  }
});


module.exports = mongoose.model('Folders', folderSchema);