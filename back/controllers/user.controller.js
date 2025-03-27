const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { firstname, lastname, email, password, role } = req.body;

  try {
    const hashedPass = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstname,
      lastname,
      email: email.toLowerCase(),
      password: hashedPass,
      role,
      isBanned: false
    });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during registration:', error.message);
    res.status(500).json({ message: 'Error registering user' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: 'Email and password are required',
    });
  }

  try {
    // Find the user by email, making sure it's case insensitive
    const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+password');

    // Log the user object to check if it's being found correctly
    console.log('User found:', user);

    if (!user) {
      return res.status(401).json({
        message: 'Invalid credentials',
      });
    }

    // Compare the entered password with the stored hash
    const isMatch = await bcrypt.compare(password, user.password);

    // Log the result of password comparison for debugging
    console.log('Password match:', isMatch);

    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid credentials',
      });
    }

    // If the user is banned, return a 403 error
    if (user.isBanned) {
      return res.status(403).json({
        message: 'Account suspended',
      });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user._id },
      '123456789', // You should move this secret to an environment variable
      { expiresIn: '1h' }
    );

    // Create a user object without the password field
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    // Respond with the token and user details
    res.status(200).json({
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Login error details:', {
      error: error.message,
      stack: error.stack,
      requestBody: req.body,
    });

    // Return proper error response in JSON format
    res.status(500).json({
      message: 'Authentication process failed',
      detail: error.message,
    });
  }
};


exports.getUserById = async (req, res)=>{

    const { id } = req.params;
    try {
        
        const user = await User.findById(id , { password: 0 } );
        res.status(200).json(user);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.editUser = async (req, res)=>{
    try {

        const { id } = req.params;

        if(req.body.password){
            req.body.password = await bcrypt.hash( req.body.password, 10 );
        }
        await User.findByIdAndUpdate({ _id: id } , req.body);

        res.status(200).json({message: 'user updated'});
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.updateUserRole = async (req, res) => {
    try {
      const { userId, role } = req.body;
      const user = await User.findByIdAndUpdate(userId, { role }, { new: true });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json({ message: 'User role updated successfully', user });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
