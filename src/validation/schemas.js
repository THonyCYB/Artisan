const Joi = require('joi');

exports.userSchema = {
  register: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    name: Joi.string().required(),
    role: Joi.string().valid('user', 'artisan').default('user'),
    profile: Joi.object({
      phoneNumber: Joi.string(),
      address: Joi.string(),
      bio: Joi.string(),
      website: Joi.string().uri(),
      socialMedia: Joi.object({
        facebook: Joi.string(),
        instagram: Joi.string(),
        twitter: Joi.string()
      })
    })
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  updateProfile: Joi.object({
    name: Joi.string(),
    profile: Joi.object({
      phoneNumber: Joi.string(),
      address: Joi.string(),
      bio: Joi.string(),
      website: Joi.string().uri(),
      socialMedia: Joi.object({
        facebook: Joi.string(),
        instagram: Joi.string(),
        twitter: Joi.string()
      })
    })
  })
};

exports.productSchema = {
  create: Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    category: Joi.string().required(),
    price: Joi.number().min(0).required(),
    images: Joi.array().items(
      Joi.object({
        url: Joi.string().required(),
        alt: Joi.string()
      })
    ),
    specifications: Joi.object({
      dimensions: Joi.string(),
      weight: Joi.string(),
      materials: Joi.array().items(Joi.string()),
      customizable: Joi.boolean()
    }),
    inventory: Joi.object({
      quantity: Joi.number().min(0).required(),
      sku: Joi.string()
    }),
    tags: Joi.array().items(Joi.string())
  }),

  update: Joi.object({
    name: Joi.string(),
    description: Joi.string(),
    category: Joi.string(),
    price: Joi.number().min(0),
    images: Joi.array().items(
      Joi.object({
        url: Joi.string().required(),
        alt: Joi.string()
      })
    ),
    specifications: Joi.object({
      dimensions: Joi.string(),
      weight: Joi.string(),
      materials: Joi.array().items(Joi.string()),
      customizable: Joi.boolean()
    }),
    inventory: Joi.object({
      quantity: Joi.number().min(0),
      sku: Joi.string()
    }),
    tags: Joi.array().items(Joi.string()),
    isActive: Joi.boolean()
  })
};

exports.orderSchema = {
  create: Joi.object({
    products: Joi.array().items(
      Joi.object({
        product: Joi.string().required(), // Product ID
        quantity: Joi.number().min(1).required(),
        customization: Joi.string()
      })
    ).required(),
    shippingAddress: Joi.object({
      street: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      postalCode: Joi.string().required(),
      country: Joi.string().required()
    }).required(),
    paymentInfo: Joi.object({
      method: Joi.string().valid('credit_card', 'bank_transfer', 'paypal').required()
    }).required(),
    notes: Joi.string()
  }),

  updateStatus: Joi.object({
    status: Joi.string()
      .valid('confirmed', 'processing', 'shipped', 'delivered', 'cancelled')
      .required(),
    note: Joi.string()
  })
};