const express = require('express');
const router = express.Router();
const giftController = require('../controllers/giftController');

// GET /api/gifts - Lista todos os presentes
router.get('/gifts', giftController.getAllGifts);

// POST /api/reserve - Reserva um presente
router.post('/reserve', giftController.reserveGift);

module.exports = router;
