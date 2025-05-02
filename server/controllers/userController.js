const User = require('../models/userModel');
const Joi = require('joi');

exports.getAllUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

const userSchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  email: Joi.string().email().required()
});

exports.createUser = async (req, res) => {
  const { error } = userSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: 'Validation failed',
      details: error.details.map(d => d.message)
    });
  }

  try {
    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


exports.getUserById = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
};


const userUpdateSchema = Joi.object({
  name: Joi.string().min(1).max(100),
  email: Joi.string().email()
});

exports.updateUser = async (req, res) => {
  const { error } = userUpdateSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: 'Validation failed',
      details: error.details.map(d => d.message)
    });
  }

  try {
    const { id } = req.params;
    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update user', error: err.message });
  }
};


exports.deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'User deleted' });
};

const userSearchSchema = Joi.object({
  name: Joi.string().min(1).max(100),
  email: Joi.string()
});

//Search Function
exports.searchUsers = async (req, res) => {
  try {
    const { error } = userSearchSchema.validate(req.query);
    if (error) {
      return res.status(400).json({
        message: 'Validation failed',
        details: error.details.map((d) => d.message)
      });
    }

    const { name, email } = req.query;

    const filter = {};
    if (name) filter.name = { $regex: name, $options: 'i' };
    if (email) filter.email = { $regex: email, $options: 'i' };

    const users = await User.find(filter);
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Search failed', error: err.message });
  }
};


exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser);
  } catch (err) {
    console.error('Update failed:', err.message);
    res.status(500).json({ message: 'Failed to update user' });
  }
};