const express = require('express');
const { createProposal, getProposalsByServiceId, getProposalsByUserId, deleteProposal, acceptProposal } = require('../controllers/proposal.controller');

const router = express.Router();

router.post('/', createProposal);
router.get('/service/:id', getProposalsByServiceId);
router.get('/user/:id', getProposalsByUserId);
router.delete('/:id', deleteProposal);
router.put('/accept/:id', acceptProposal);

module.exports = router;