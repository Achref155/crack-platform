const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/Detect-crack')
  .then(() => {
    console.log('connected to db');
  })
  .catch((err) => {
    console.error('Error connecting to db:', err);
  });