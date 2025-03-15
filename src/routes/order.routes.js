const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');

const orderController = {
  createOrder: async (req, res) => {
    try {
      const Order = require('../models/order.model');
      const Product = require('../models/product.model');

      // Validate products and calculate total amount
      const orderProducts = [];
      let totalAmount = 0;

      for (const item of req.body.products) {
        const product = await Product.findById(item.product);
        if (!product) {
          return res.status(404).json({
            status: 'error',
            message: `Product not found: ${item.product}`
          });
        }

        if (product.inventory.quantity < item.quantity) {
          return res.status(400).json({
            status: 'error',
            message: `Insufficient inventory for product: ${product.name}`
          });
        }

        orderProducts.push({
          product: item.product,
          quantity: item.quantity,
          price: product.price,
          customization: item.customization
        });

        totalAmount += product.price * item.quantity;
      }

      const order = new Order({
        customer: req.user._id,
        products: orderProducts,
        totalAmount,
        shippingAddress: req.body.shippingAddress,
        paymentInfo: req.body.paymentInfo,
        notes: req.body.notes
      });

      await order.save();

      // Update product inventory
      for (const item of orderProducts) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { 'inventory.quantity': -item.quantity }
        });
      }

      res.status(201).json({
        status: 'success',
        data: { order }
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  },

  getOrders: async (req, res) => {
    try {
      const Order = require('../models/order.model');
      const orders = await Order.find({ customer: req.user._id })
        .populate('products.product')
        .sort('-createdAt');

      res.status(200).json({
        status: 'success',
        data: { orders }
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  },

  updateOrderStatus: async (req, res) => {
    try {
      const Order = require('../models/order.model');
      const order = await Order.findById(req.params.id);

      if (!order) {
        return res.status(404).json({
          status: 'error',
          message: 'Order not found'
        });
      }

      order.status = req.body.status;
      if (req.body.note) {
        order.statusHistory.push({
          status: req.body.status,
          note: req.body.note
        });
      }

      await order.save();

      res.status(200).json({
        status: 'success',
        data: { order }
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  }
};

router.post('/', protect, orderController.createOrder);
router.get('/', protect, orderController.getOrders);
router.patch('/:id/status', protect, orderController.updateOrderStatus);

module.exports = router;