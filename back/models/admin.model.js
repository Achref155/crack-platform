const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({

  firstname: String,
  lastname: String,
  email: { type: String, unique: true },
  image: {
    type: String,
    default: 'avatar.png'
}
});

module.exports = mongoose.model('Admin', adminSchema);