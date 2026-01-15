const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// Chave secreta - OBRIGATÓRIA em produção
if (!process.env.JWT_SECRET) {
    console.error('❌ ERRO CRÍTICO: JWT_SECRET não configurado!');
    console.error('💡 Configure JWT_SECRET no painel da Hostinger.');
    throw new Error('JWT_SECRET não configurado. Configure no painel da Hostinger.');
}

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Middleware de autenticação
 */
async function authenticate(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Token de autenticação não fornecido'
            });
        }
        
        const token = authHeader.substring(7);
        
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            req.adminId = decoded.adminId;
            next();
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: 'Token inválido ou expirado'
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Erro na autenticação'
        });
    }
}

/**
 * Gera token JWT
 */
function generateToken(adminId) {
    return jwt.sign(
        { adminId },
        JWT_SECRET,
        { expiresIn: '24h' }
    );
}

module.exports = {
    authenticate,
    generateToken
};
