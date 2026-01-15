const express = require('express');
const router = express.Router();
const giftController = require('../controllers/giftController');

// GET /api/health - Health check (para diagnóstico)
router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'API está funcionando',
        timestamp: new Date().toISOString()
    });
});

// GET /api/gifts - Lista todos os presentes
router.get('/gifts', giftController.getAllGifts);

// POST /api/reserve - Reserva um presente
router.post('/reserve', giftController.reserveGift);

module.exports = router;
