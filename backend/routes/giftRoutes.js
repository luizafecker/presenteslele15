const express = require('express');
const router = express.Router();
const giftController = require('../controllers/giftController');
const db = require('../config/database');

// GET /api/health - Health check (para diagnóstico)
router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'API está funcionando',
        timestamp: new Date().toISOString()
    });
});

// GET /api/test-db - Teste de conexão com banco (para diagnóstico)
router.get('/test-db', async (req, res) => {
    try {
        // Testa conexão
        const connection = await db.pool.getConnection();
        await connection.query('SELECT 1');
        connection.release();
        
        // Testa se tabela existe
        const tables = await db.query("SHOW TABLES LIKE 'gifts'");
        const tableExists = tables.length > 0;
        
        // Se tabela existe, tenta contar registros
        let recordCount = 0;
        if (tableExists) {
            try {
                const count = await db.query('SELECT COUNT(*) as total FROM gifts');
                recordCount = count[0]?.total || 0;
            } catch (err) {
                // Ignora erro de contagem
            }
        }
        
        res.json({
            success: true,
            database: {
                connected: true,
                tableExists: tableExists,
                recordCount: recordCount,
                config: {
                    host: process.env.DB_HOST || 'not set',
                    database: process.env.DB_NAME || 'not set',
                    user: process.env.DB_USER || 'not set'
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: {
                message: error.message,
                code: error.code,
                sqlState: error.sqlState
            },
            config: {
                host: process.env.DB_HOST || 'not set',
                database: process.env.DB_NAME || 'not set',
                user: process.env.DB_USER || 'not set'
            }
        });
    }
});

// GET /api/gifts - Lista todos os presentes
router.get('/gifts', giftController.getAllGifts);

// POST /api/reserve - Reserva um presente
router.post('/reserve', giftController.reserveGift);

module.exports = router;
