// routes/services.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Service = require('../models/Service');
const Incident = require('../models/Incident');

// @route   GET api/services
// @desc    Get all services
// @access  Public
router.get('/', async (req, res) => {
  try {
    const services = await Service.find().sort({ name: 1 });
    res.json(services);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/services
// @desc    Create a service
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { name, status, uptime } = req.body;
    
    // Check if service already exists
    let service = await Service.findOne({ name });
    if (service) {
      return res.status(400).json({ msg: 'Service already exists' });
    }
    
    // Create new service
   
    service = new Service({
      name,
      status,
      uptime: ((Math.random() * 60 + 40).toFixed(2) + '%')
    });
    
    
    await service.save();
    res.json(service);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/services/:id
// @desc    Update a service
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, status, uptime } = req.body;
    
    // Build service object
    const serviceFields = {};
    if (name) serviceFields.name = name;
    if (status) serviceFields.status = status;
    if (uptime) serviceFields.uptime = uptime;
    
    // Update service
    let service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ msg: 'Service not found' });
    }
    
    service = await Service.findByIdAndUpdate(
      req.params.id,
      { $set: serviceFields },
      { new: true }
    );
    
    res.json(service);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Service not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/services/:id
// @desc    Delete a service
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    // Find service
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ msg: 'Service not found' });
    }
    
    // Check if service is referenced in any incidents
    const incidents = await Incident.find({ affectedServices: req.params.id });
    if (incidents.length > 0) {
      return res.status(400).json({ 
        msg: 'Cannot delete service that is referenced in incidents',
        incidents: incidents.map(i => ({ id: i._id, title: i.title }))
      });
    }
    
    // Delete service
    await Service.findByIdAndRemove(req.params.id);
    res.json({ msg: 'Service removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Service not found' });
    }
    res.status(500).send('Server Error');
  }
});
/*
router.delete('/:name', auth, async (req, res) => {
  try {
    // Find service by name
    const service = await Service.findOne({ name: req.params.name });
    if (!service) {
      return res.status(404).json({ msg: 'Service not found' });
    }

    // Check if service is referenced in any incidents
    const incidents = await Incident.find({ affectedServices: service._id });
    if (incidents.length > 0) {
      return res.status(400).json({ 
        msg: 'Cannot delete service that is referenced in incidents',
        incidents: incidents.map(i => ({ id: i._id, title: i.title }))
      });
    }

    // Delete service
    await Service.findByIdAndRemove(service._id);
    res.json({ msg: 'Service removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});*/


module.exports = router;
