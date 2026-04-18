import mongoose from 'mongoose';

const OrderItemSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['Shirt', 'Pants', 'Saree', 'T-Shirt'],
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
  }
});

const OrderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true,
  },
  customerName: {
    type: String,
    required: true,
  },
  customerPhone: {
    type: String,
    required: true,
  },
  items: [OrderItemSchema],
  total: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['RECEIVED', 'PROCESSING', 'READY', 'DELIVERED'],
    default: 'RECEIVED',
  },
  payment: {
    type: String,
    enum: ['UNPAID', 'PAID'],
    default: 'UNPAID',
  }
}, {
  timestamps: true,
});

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
