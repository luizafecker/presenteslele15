const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Garante que a pasta de uploads existe
const uploadsDir = path.join(__dirname, '../../uploads/images');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configuração do multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        // Gera nome único: timestamp + número aleatório + extensão original
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, 'gift-' + uniqueSuffix + ext);
    }
});

// Filtro para aceitar apenas imagens
const fileFilter = (req, file, cb) => {
    // Tipos MIME permitidos
    const allowedMimes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp'
    ];
    
    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Tipo de arquivo não permitido. Apenas imagens (JPEG, PNG, GIF, WebP) são aceitas.'), false);
    }
};

// Configuração do upload
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB máximo
    }
});

module.exports = upload;
