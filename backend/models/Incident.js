// models/Incident.js
const mongoose = require('mongoose');

const IncidentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['investigating', 'identified', 'monitoring', 'resolved'],
    default: 'investigating'
  },
  severity: {
    type: String,
    enum: ['minor', 'major', 'critical'],
    default: 'minor'
  },
  affectedServices: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  resolvedAt: {
    type: Date
  },
  updates: [{
    message: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['investigating', 'identified', 'monitoring', 'resolved'],
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
});

// Update the updatedAt field on save
IncidentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Incident', IncidentSchema);