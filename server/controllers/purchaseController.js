const Purchase = require('../models/purchaseModel');

const Joi = require('joi');

// Validation schemas
const purchaseSchema = Joi.object({
  item: Joi.string().min(1).max(100).required(),
  amount: Joi.number().min(0).required(),
  user: Joi.string().length(24).hex().required()  // MongoDB ObjectId
});

const purchaseUpdateSchema = Joi.object({
  item: Joi.string().min(1).max(100),
  amount: Joi.number().min(0),
  user: Joi.string().length(24).hex()
});

exports.getAllPurchases = async (req, res) => {
  const purchases = await Purchase.find().populate('user');
  res.json(purchases);
};

exports.createPurchase = async (req, res) => {
  //Handles Post request.
  
  const { error } = purchaseSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: 'Validation failed',
      details: error.details.map(d => d.message)
    });
  }

  try {
    const newPurchase = new Purchase(req.body);
    const savedPurchase = await newPurchase.save();
    res.status(201).json(savedPurchase);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getPurchaseById = async (req, res) => {
  const purchase = await Purchase.findById(req.params.id).populate('user');
  if (!purchase) return res.status(404).json({ message: 'Purchase not found' });
  res.json(purchase);
};

exports.getPurchasesByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const purchases = await Purchase.find({ user: userId }).populate('user');
    res.json(purchases);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch purchases for user.' });
  }
};

exports.updatePurchase = async (req, res) => {
  const { error } = purchaseUpdateSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: 'Validation failed',
      details: error.details.map(d => d.message)
    });
  }

  try {
    const updated = await Purchase.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!updated) {
      return res.status(404).json({ message: 'Purchase not found' });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


exports.deletePurchase = async (req, res) => {
  await Purchase.findByIdAndDelete(req.params.id);
  res.json({ message: 'Purchase deleted' });
};
