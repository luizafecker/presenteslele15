const Gift = require('../models/Gift');

/**
 * Lista todos os presentes
 */
async function getAllGifts(req, res) {
    try {
        const gifts = await Gift.findAll();
        
        // Garante que sempre retorna um array, mesmo se vazio
        const giftsArray = Array.isArray(gifts) ? gifts : [];
        
        res.json({
            success: true,
            gifts: giftsArray
        });
    } catch (error) {
        // Log detalhado do erro para debug em produção
        console.error('❌ Erro ao buscar presentes:', {
            message: error.message,
            code: error.code,
            sqlState: error.sqlState,
            sqlMessage: error.sqlMessage,
            stack: error.stack
        });
        
        // Retorna mensagem de erro mais específica se possível
        let errorMessage = 'Erro ao buscar presentes';
        if (error.code === 'ER_NO_SUCH_TABLE') {
            errorMessage = 'Tabela de presentes não encontrada. Verifique se o schema foi importado corretamente.';
        } else if (error.code === 'ER_BAD_FIELD_ERROR') {
            errorMessage = 'Erro na estrutura do banco de dados. Verifique se as colunas existem.';
        } else if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
            errorMessage = 'Erro de conexão com o banco de dados. Verifique as configurações.';
        }
        
        res.status(500).json({
            success: false,
            message: errorMessage
        });
    }
}

/**
 * Reserva um presente
 */
async function reserveGift(req, res) {
    try {
        const { giftId, guestName } = req.body;
        
        // Validações
        if (!giftId || !guestName) {
            return res.status(400).json({
                success: false,
                message: 'Dados incompletos'
            });
        }
        
        if (typeof guestName !== 'string' || guestName.trim().length < 3) {
            return res.status(400).json({
                success: false,
                message: 'Nome deve ter pelo menos 3 caracteres'
            });
        }
        
        // Sanitiza nome do convidado
        const sanitizedName = guestName.trim().substring(0, 100);
        
        // Reserva o presente
        const reservedGift = await Gift.reserve(giftId, sanitizedName);
        
        res.json({
            success: true,
            message: 'Presente reservado com sucesso',
            gift: reservedGift
        });
    } catch (error) {
        console.error('Erro ao reservar presente:', error);
        
        if (error.message === 'Presente não encontrado') {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }
        
        if (error.message === 'Este presente já foi reservado') {
            return res.status(409).json({
                success: false,
                message: error.message
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Erro ao reservar presente'
        });
    }
}

module.exports = {
    getAllGifts,
    reserveGift
};
