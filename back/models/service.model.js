const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({

    name: String,
    location: String,
    governorate: String,
    description: String,
    crackWidth: Number,  // New field for crack width
    dangerLevel: String, // New field for danger level
    image: String,
    idUser : { type: mongoose.Schema.Types.ObjectId , ref : 'User' },
    createdAt: {
      type: Date,
      default: Date.now,
      get: function (timestamp) {
        return new Date(timestamp).toISOString().slice(0, 16).replace("T", " ");
      },
    }
});


module.exports = mongoose.model('Service' , serviceSchema);