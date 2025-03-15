const express = require('express');
const router = express.Router();
const { protect, isArtisan } = require('../middleware/auth.middleware');

const productController = {
  createProduct: async (req, res) => {
    try {
      const Product = require('../models/product.model');
      const product = new Product({
        ...req.body,
        artisan: req.user._id
      });

      await product.save();

      res.status(201).json({
        status: 'success',
        data: { product }
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  },

  getAllProducts: async (req, res) => {
    try {
      const Product = require('../models/product.model');
      const products = await Product.find({ isActive: true });

      res.status(200).json({
        status: 'success',
        data: { products }
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  },

  getProduct: async (req, res) => {
    try {
      const Product = require('../models/product.model');
      const product = await Product.findById(req.params.id);

      if (!product) {
        return res.status(404).json({
          status: 'error',
          message: 'Product not found'
        });
      }

      res.status(200).json({
        status: 'success',
        data: { product }
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  },

  updateProduct: async (req, res) => {
    try {
      const Product = require('../models/product.model');
      const product = await Product.findOneAndUpdate(
        { _id: req.params.id, artisan: req.user._id },
        req.body,
        { new: true, runValidators: true }
      );

      if (!product) {
        return res.status(404).json({
          status: 'error',
          message: 'Product not found or unauthorized'
        });
      }

      res.status(200).json({
        status: 'success',
        data: { product }
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  }
};

router.post('/', protect, isArtisan, productController.createProduct);
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProduct);
router.patch('/:id', protect, isArtisan, productController.updateProduct);

module.exports = router;