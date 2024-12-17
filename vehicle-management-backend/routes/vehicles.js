const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');

// Add a new vehicle
router.post('/', async (req, res) => {
    try {
        const { name, status } = req.body;
        const newVehicle = new Vehicle({ name, status });
        const savedVehicle = await newVehicle.save();
        res.status(201).json(savedVehicle);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update the status of a vehicle
router.put('/:id', async (req, res) => {
    try {
        const { status } = req.body;
        const updatedVehicle = await Vehicle.findByIdAndUpdate(
            req.params.id,
            { status, lastUpdated: Date.now() },
            { new: true }
        );
        if (!updatedVehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }
        res.json(updatedVehicle);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Fetch all vehicles
router.get('/', async (req, res) => {
    try {
        const vehicles = await Vehicle.find().sort({ lastUpdated: -1 });
        res.json(vehicles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
