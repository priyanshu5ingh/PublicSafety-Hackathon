const express = require('express');
const router = express.Router();
const dbModule = require('../config/db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for handling file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '../uploads/evidence');
        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: function (req, file, cb) {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(file.mimetype)) {
            const error = new Error('Only .png, .jpg and .gif format allowed!');
            error.code = 'INVALID_FILE_TYPE';
            return cb(error, false);
        }
        cb(null, true);
    }
});

// POST a new crime report with image uploads
router.post('/', upload.array('evidence_images', 5), async (req, res) => {
    console.log('Received crime report:', req.body);
    console.log('Received files:', req.files);

    const { crimeType, description, locationName, latitude, longitude, evidence, witnesses } = req.body;

    // Convert latitude and longitude to numbers for validation
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    // Validate required fields
    if (!crimeType || !description || !latitude || !longitude) {
        console.error('Missing required fields:', {
            crimeType: !!crimeType,
            description: !!description,
            latitude: !!latitude,
            longitude: !!longitude
        });
        // Delete uploaded files if validation fails
        if (req.files) {
            req.files.forEach(file => {
                fs.unlinkSync(file.path);
            });
        }
        return res.status(400).json({
            success: false,
            message: 'Please provide all required fields: crimeType, description, latitude, and longitude'
        });
    }

    // Validate latitude and longitude
    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        console.error('Invalid coordinates:', { latitude, longitude });
        if (req.files) {
            req.files.forEach(file => {
                fs.unlinkSync(file.path);
            });
        }
        return res.status(400).json({
            success: false,
            message: 'Invalid latitude or longitude values'
        });
    }

    // Process uploaded files
    const evidenceImages = req.files ? req.files.map(file => file.filename) : [];

    const sql = `
        INSERT INTO crime_reports (
            crimeType, 
            description, 
            locationName, 
            latitude, 
            longitude, 
            evidence, 
            witnesses, 
            evidence_images,
            timestamp
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const timestamp = new Date().toISOString();

    console.log('Inserting into database with values:', {
        crimeType,
        description,
        locationName,
        latitude: lat,
        longitude: lng,
        evidence,
        witnesses,
        evidenceImages,
        timestamp
    });

    try {
        const result = await dbModule.run(
            sql,
            [
                crimeType,
                description,
                locationName,
                lat,
                lng,
                evidence,
                witnesses,
                JSON.stringify(evidenceImages),
                timestamp
            ]
        );

        console.log('Crime report saved successfully with ID:', result.lastID);
        res.status(201).json({
            success: true,
            message: 'Crime reported successfully',
            id: result.lastID,
            evidenceImages
        });
    } catch (err) {
        console.error('Database error:', err);
        // Delete uploaded files if database insertion fails
        evidenceImages.forEach(filename => {
            const filepath = path.join(__dirname, '../uploads/evidence', filename);
            fs.unlinkSync(filepath);
        });
        return res.status(500).json({
            success: false,
            message: 'Error reporting crime. Please try again.',
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
});

// GET all crime reports
router.get('/', async (req, res) => {
    const sql = `
        SELECT 
            id,
            crimeType,
            description,
            locationName,
            latitude,
            longitude,
            evidence,
            witnesses,
            evidence_images,
            timestamp
        FROM crime_reports
        ORDER BY timestamp DESC
    `;

    try {
        const rows = await dbModule.all(sql, []);
        
        // Parse evidence_images JSON string for each row
        const processedRows = rows.map(row => ({
            ...row,
            evidence_images: row.evidence_images ? JSON.parse(row.evidence_images) : []
        }));

        res.json(processedRows);
    } catch (err) {
        console.error('Database error:', err);
        return res.status(500).json({
            success: false,
            message: 'Error fetching crime reports'
        });
    }
});

// Serve evidence images
router.get('/evidence/:filename', (req, res) => {
    const filepath = path.join(__dirname, '../uploads/evidence', req.params.filename);
    res.sendFile(filepath);
});

// GET a specific crime report
router.get('/:id', async (req, res) => {
    const sql = `
        SELECT 
            id,
            crimeType,
            description,
            locationName,
            latitude,
            longitude,
            evidence,
            witnesses,
            evidence_images,
            timestamp
        FROM crime_reports
        WHERE id = ?
    `;

    try {
        const row = await dbModule.get(sql, [req.params.id]);
        
        if (!row) {
            return res.status(404).json({
                success: false,
                message: 'Crime report not found'
            });
        }

        // Parse evidence_images JSON string
        row.evidence_images = row.evidence_images ? JSON.parse(row.evidence_images) : [];

        res.json(row);
    } catch (err) {
        console.error('Database error:', err);
        return res.status(500).json({
            success: false,
            message: 'Error fetching crime report'
        });
    }
});

module.exports = router;