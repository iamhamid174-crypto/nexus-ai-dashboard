const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    plan: {
      type: String,
      enum: ['starter', 'pro', 'enterprise'],
      default: 'starter',
    },
    billing: { type: String, enum: ['monthly', 'annual'], default: 'monthly' },
    status: {
      type: String,
      enum: ['active', 'cancelled', 'past_due', 'trialing', 'paused'],
      default: 'active',
    },
    price: { type: Number, default: 0 },
    currency: { type: String, default: 'USD' },
    currentPeriodStart: { type: Date, default: Date.now },
    currentPeriodEnd: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    cancelAtPeriodEnd: { type: Boolean, default: false },
    paymentMethod: {
      last4: { type: String },
      brand: { type: String },
      expMonth: { type: Number },
      expYear: { type: Number },
    },
    invoices: [
      {
        invoiceId: String,
        amount: Number,
        status: { type: String, enum: ['paid', 'failed', 'pending'] },
        date: Date,
        pdfUrl: String,
      },
    ],
    usage: {
      wordsGenerated: { type: Number, default: 0 },
      wordsLimit: { type: Number, default: 5000 },
      projectsCount: { type: Number, default: 0 },
      projectsLimit: { type: Number, default: 2 },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Subscription', SubscriptionSchema);
