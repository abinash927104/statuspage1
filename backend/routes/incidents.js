// routes/incidents.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Incident = require('../models/Incident');
const Service = require('../models/Service');
const mongoose = require('mongoose');

// @route   GET api/incidents
// @desc    Get all incidents
// @access  Public
router.get('/', async (req, res) => {
  try {
    // Default to active incidents only
    const status = req.query.status || { $ne: 'resolved' };
    
    const incidents = await Incident.find({ status })
      .sort({ createdAt: -1 })
      .populate('affectedServices', 'name status');
      
    res.json(incidents);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/incidents/:id
// @desc    Get incident by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id)
      .populate('affectedServices', 'name status');
      
    if (!incident) {
      return res.status(404).json({ msg: 'Incident not found' });
    }
    
    res.json(incident);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Incident not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST api/incidents
// @desc    Create an incident
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, severity, affectedServices } = req.body;
    
    // Validate affected services
    if (affectedServices && affectedServices.length > 0) {
      for (const serviceId of affectedServices) {
        if (!mongoose.Types.ObjectId.isValid(serviceId)) {
          return res.status(400).json({ msg: `Invalid service ID: ${serviceId}` });
        }
        
        const service = await Service.findById(serviceId);
        if (!service) {
          return res.status(400).json({ msg: `Service not found: ${serviceId}` });
        }
      }
    }
    
    // Create new incident
    const incident = new Incident({
      title,
      description,
      severity,
      affectedServices,
      updates: [{
        message: `Incident reported: ${description}`,
        status: 'investigating'
      }]
    });
    
    // Update affected services status based on severity
    if (affectedServices && affectedServices.length > 0) {
      const newStatus = severity === 'critical' ? 'outage' : 'degraded';
      await Service.updateMany(
        { _id: { $in: affectedServices } },
        { $set: { status: newStatus } }
      );
    }
    
    await incident.save();
    
    // Return the populated incident
    const populatedIncident = await Incident.findById(incident._id)
      .populate('affectedServices', 'name status');
      
    res.json(populatedIncident);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/incidents/:id
// @desc    Update an incident
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, description, status, severity, affectedServices, updateMessage } = req.body;
    
    // Find incident
    let incident = await Incident.findById(req.params.id);
    if (!incident) {
      return res.status(404).json({ msg: 'Incident not found' });
    }
    
    // Build incident object
    const incidentFields = {};
    if (title) incidentFields.title = title;
    if (description) incidentFields.description = description;
    if (status) {
      incidentFields.status = status;
      
      // If resolving, add resolvedAt timestamp
      if (status === 'resolved' && incident.status !== 'resolved') {
        incidentFields.resolvedAt = Date.now();
        
        // Reset affected services to operational
        if (incident.affectedServices && incident.affectedServices.length > 0) {
          await Service.updateMany(
            { _id: { $in: incident.affectedServices } },
            { $set: { status: 'operational' } }
          );
        }
      }
    }
    if (severity) incidentFields.severity = severity;
    
    // Handle affected services changes
    if (affectedServices) {
      // Validate affected services
      for (const serviceId of affectedServices) {
        if (!mongoose.Types.ObjectId.isValid(serviceId)) {
          return res.status(400).json({ msg: `Invalid service ID: ${serviceId}` });
        }
        
        const service = await Service.findById(serviceId);
        if (!service) {
          return res.status(400).json({ msg: `Service not found: ${serviceId}` });
        }
      }
      
      incidentFields.affectedServices = affectedServices;
      
      // Update new services status
      const newStatus = severity || incident.severity === 'critical' ? 'outage' : 'degraded';
      
      // Reset previously affected services that are no longer in the list
      const servicesToReset = incident.affectedServices.filter(
        id => !affectedServices.includes(id.toString())
      );
      
      if (servicesToReset.length > 0) {
        await Service.updateMany(
          { _id: { $in: servicesToReset } },
          { $set: { status: 'operational' } }
        );
      }
      
      // Update newly affected services
      await Service.updateMany(
        { _id: { $in: affectedServices } },
        { $set: { status: newStatus } }
      );
    }
    
    // Add update to incident log if message is provided
    if (updateMessage) {
      const update = {
        message: updateMessage,
        status: status || incident.status,
        createdAt: Date.now()
      };
      
      // Use $push to add to updates array
      await Incident.findByIdAndUpdate(
        req.params.id,
        { $push: { updates: update } }
      );
    }
    
    // Update incident
    incident = await Incident.findByIdAndUpdate(
      req.params.id,
      { $set: incidentFields },
      { new: true }
    ).populate('affectedServices', 'name status');
    
    res.json(incident);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Incident not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/incidents/:id
// @desc    Delete an incident
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    // Find incident
    const incident = await Incident.findById(req.params.id);
    if (!incident) {
      return res.status(404).json({ msg: 'Incident not found' });
    }
    
    // Reset affected services to operational
    if (incident.affectedServices && incident.affectedServices.length > 0) {
      await Service.updateMany(
        { _id: { $in: incident.affectedServices } },
        { $set: { status: 'operational' } }
      );
    }
    
    // Delete incident
    await Incident.findByIdAndRemove(req.params.id);
    res.json({ msg: 'Incident removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Incident not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
