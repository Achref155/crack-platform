const Proposal = require('../models/proposal.model');



exports.getAllProposals = async (req, res) => {
  try {
    // Fetch users but exclude those with role 'admin'
    const users = await User.find({ role: { $ne: 'admin' } }, { _idService: 1, firstname: 1, lastname: 1, email: 1 })
                           .lean()
                           .exec();
    
    const usersWithId = users.map(user => {
      return { ...user, id: user._id };
    });

    res.json(usersWithId);
  } catch (error) {
    res.status(500).send('Server error');
  }
};

exports.createProposal = async (req, res) => {
    try {
        const newProposal = new Proposal(req.body);
        await newProposal.save();
        res.status(201).json({ message: 'proposal created' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getProposalsByServiceId = async (req, res) => {
    try {
        const proposals = await Proposal.find({ idService: req.params.id }).populate('idUser', 'firstname lastname image');
        res.status(200).json(proposals);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getProposalsByUserId = async (req, res) => {
    try {
      const userId = req.params.id;
      const proposals = await Proposal.find({ idUser: userId }).populate('idService').populate('idUser');
      res.status(200).json(proposals);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching proposals', error });
    }
  };

exports.deleteProposal = async (req, res) => {
    try {
        await Proposal.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'proposal deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.acceptProposal = async (req, res) => {
    try {
        await Proposal.findByIdAndUpdate({ _id: req.params.id }, { status: true });
        res.status(200).json({ message: 'accepted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};