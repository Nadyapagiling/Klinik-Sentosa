const express = require('express');
const router = express.Router();
const Data = require('./models/Data');

router.post('/save', async (req, res) => {
  try {
    const { name, email, phone, address, type, metadata } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Name is required' });
    }
    const newData = new Data({ name, email, phone, address, type: type || 'other', metadata: metadata || {} });
    const savedData = await newData.save();
    res.status(201).json({ success: true, data: savedData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/data', async (req, res) => {
  try {
    const data = await Data.find().sort({ createdAt: -1 });
    res.json({ success: true, data: data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/data/:id', async (req, res) => {
  try {
    const data = await Data.findById(req.params.id);
    if (!data) {
      return res.status(404).json({ success: false, message: 'Data not found' });
    }
    res.json({ success: true, data: data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/data/:id', async (req, res) => {
  try {
    const data = await Data.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!data) {
      return res.status(404).json({ success: false, message: 'Data not found' });
    }
    res.json({ success: true, data: data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/data/:id', async (req, res) => {
  try {
    const data = await Data.findByIdAndDelete(req.params.id);
    if (!data) {
      return res.status(404).json({ success: false, message: 'Data not found' });
    }
    res.json({ success: true, message: 'Data deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;