const mongoose = require('mongoose');

const proposalSchema = new mongoose.Schema({  // Corrected typo

    price: Number,
    days: Number,
    cover: {
        type: String
    },
    status: {
        type: Boolean,
        default: false
    },
    idService: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
    idUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Proposal', proposalSchema);