const Purchase = require('../models/purchaseModel');

exports.getAllPurchases = async (req, res) => {
  const purchases = await Purchase.find().populate('user');
  res.json(purchases);
};

exports.createPurchase = async (req, res) => {
  try {
    const newPurchase = new Purchase(req.body);
    const savedPurchase = await newPurchase.save();
    res.status(201).json(savedPurchase);
  } catch (error) {
    // Catch Mongoose validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    // Catch any other server errors
    res.status(500).json({ message: 'Server error' });
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
  const updated = await Purchase.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
};

exports.deletePurchase = async (req, res) => {
  await Purchase.findByIdAndDelete(req.params.id);
  res.json({ message: 'Purchase deleted' });
};
