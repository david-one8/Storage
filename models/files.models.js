const mongoose = require('mongoose');



const fileSchema = new mongoose.Schema({
  path: {
    type: String,
    required: [true, 'File path is required'],
  },
  originalname: {
    type: String,
    required: [true, 'Original file name is required'],
  },
  fileType: {
    type: String,
    required: [true, 'File type is required'],
  },
  fileSize: {
    type: Number,
    required: [true, 'File size is required'],
  },
  customName: {
    type: String,
    default: ''
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: [true, 'User is required'],
  },
});

const File = mongoose.model('File', fileSchema);

module.exports = File;
