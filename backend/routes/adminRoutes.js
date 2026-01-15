const express = require('express');
const multer = require('multer');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate } = require('../middleware/auth');
const upload = require('../middleware/upload');

// POST /api/admin/login - Login administrativo
router.post('/login', adminController.login);

// Todas as rotas abaixo requerem autenticação
router.use(authenticate);

// GET /api/admin/gifts - Lista presentes (admin)
router.get('/gifts', adminController.getGifts);

// Middleware para tratar erros do multer
const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'Arquivo muito grande. Tamanho máximo: 5MB'
            });
        }
        return res.status(400).json({
            success: false,
            message: 'Erro ao fazer upload do arquivo: ' + err.message
        });
    }
    if (err) {
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }
    next();
};

// POST /api/admin/gifts - Cria novo presente
router.post('/gifts', (req, res, next) => {
    upload.single('image')(req, res, (err) => {
        if (err) {
            return handleMulterError(err, req, res, next);
        }
        next();
    });
}, adminController.createGift);

// PUT /api/admin/gifts/:id - Atualiza presente
router.put('/gifts/:id', (req, res, next) => {
    upload.single('image')(req, res, (err) => {
        if (err) {
            return handleMulterError(err, req, res, next);
        }
        next();
    });
}, adminController.updateGift);

// DELETE /api/admin/gifts/:id - Remove presente
router.delete('/gifts/:id', adminController.deleteGift);

// PATCH /api/admin/gifts/:id/status - Atualiza status (reservar/liberar)
router.patch('/gifts/:id/status', adminController.updateGiftStatus);

// PATCH /api/admin/gifts/:id/reserved-by - Atualiza nome da pessoa que reservou
router.patch('/gifts/:id/reserved-by', adminController.updateReservedBy);

module.exports = router;
