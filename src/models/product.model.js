const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  artisan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  images: [{
    url: String,
    alt: String
  }],
  specifications: {
    dimensions: String,
    weight: String,
    materials: [String],
    customizable: {
      type: Boolean,
      default: false
    }
  },
  inventory: {
    quantity: {
      type: Number,
      required: true,
      min: 0
    },
    sku: String,
    status: {
      type: String,
      enum: ['in_stock', 'low_stock', 'out_of_stock'],
      default: 'in_stock'
    }
  },
  tags: [String],
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Update inventory status based on quantity
productSchema.pre('save', function(next) {
  if (this.inventory.quantity <= 0) {
    this.inventory.status = 'out_of_stock';
  } else if (this.inventory.quantity <= 5) {
    this.inventory.status = 'low_stock';
  } else {
    this.inventory.status = 'in_stock';
  }
  next();
});

// Index for search functionality
productSchema.index({ name: 'text', description: 'text', tags: 'text' });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;