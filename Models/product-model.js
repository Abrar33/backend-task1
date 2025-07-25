const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  description: {
    type: String,
    required: true
  },

  price: {
    type: Number,
    required: true,
    min: 0
  },

  category: {
    type: String,
    required: true
  },

  stock: {
    type: Number,
    default: 0
  },
variations:[
  {
    images:[
      {type: String, required: true}
    ]
  },{
    size: { type: String },
    color: { type: String, required: true }
  }
]
 ,

  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', productSchema);