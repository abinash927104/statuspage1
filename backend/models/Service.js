const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['operational', 'degraded', 'outage'],
    default: 'operational'
  },
  uptime: {
    type: String,
    default: '100%'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field on save
ServiceSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Service', ServiceSchema);
