const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
  item: { type: String, required: true },
  amount: { type: Number, required: true, min: 0 },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Purchase', purchaseSchema);
