const Gift = require('../models/Gift');

/**
 * Lista todos os presentes
 */
async function getAllGifts(req, res) {
    try {
        console.log('🔄 Iniciando busca de presentes...');
        console.log('📊 Configuração do banco:', {
            host: process.env.DB_HOST || 'not set',
            database: process.env.DB_NAME || 'not set',
            user: process.env.DB_USER || 'not set'
        });
        
        const gifts = await Gift.findAll();
        
        // Garante que sempre retorna um array, mesmo se vazio
        const giftsArray = Array.isArray(gifts) ? gifts : [];
        
        console.log(`✅ Busca concluída. Retornando ${giftsArray.length} presentes.`);
        
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
            errno: error.errno,
            stack: error.stack ? error.stack.substring(0, 500) : 'no stack'
        });
        
        // Retorna mensagem de erro mais específica se possível
        let errorMessage = 'Erro ao buscar presentes';
        let errorDetails = null;
        
        if (error.code === 'ER_NO_SUCH_TABLE') {
            errorMessage = 'Tabela de presentes não encontrada. Verifique se o schema foi importado corretamente.';
        } else if (error.code === 'ER_BAD_FIELD_ERROR') {
            errorMessage = 'Erro na estrutura do banco de dados. Verifique se as colunas existem.';
            errorDetails = error.sqlMessage;
        } else if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
            errorMessage = 'Erro de conexão com o banco de dados. Verifique as configurações.';
        } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            errorMessage = 'Acesso negado ao banco de dados. Verifique usuário e senha.';
        } else if (error.code === 'ER_BAD_DB_ERROR') {
            errorMessage = 'Banco de dados não encontrado. Verifique o nome do banco.';
        } else {
            // Em desenvolvimento, mostra mais detalhes
            if (process.env.NODE_ENV !== 'production') {
                errorDetails = error.message;
            }
        }
        
        res.status(500).json({
            success: false,
            message: errorMessage,
            ...(errorDetails && { details: errorDetails }),
            ...(process.env.NODE_ENV !== 'production' && { 
                errorCode: error.code,
                sqlState: error.sqlState 
            })
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
