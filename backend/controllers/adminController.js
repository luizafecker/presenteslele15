const Admin = require('../models/Admin');
const Gift = require('../models/Gift');
const { generateToken } = require('../middleware/auth');
const path = require('path');
const fs = require('fs');

/**
 * Login administrativo
 */
async function login(req, res) {
    try {
        const { password } = req.body;
        
        if (!password) {
            return res.status(400).json({
                success: false,
                message: 'Senha é obrigatória'
            });
        }
        
        // Verifica senha
        const admin = await Admin.verifyPassword(password);
        
        // Gera token
        const token = generateToken(admin.id);
        
        res.json({
            success: true,
            message: 'Login realizado com sucesso',
            token
        });
    } catch (error) {
        console.error('Erro no login:', error);
        
        if (error.message === 'Senha incorreta' || error.message === 'Admin não configurado') {
            return res.status(401).json({
                success: false,
                message: error.message
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Erro ao realizar login'
        });
    }
}

/**
 * Lista presentes (admin)
 */
async function getGifts(req, res) {
    try {
        const gifts = await Gift.findAll();
        
        res.json({
            success: true,
            gifts
        });
    } catch (error) {
        console.error('Erro ao buscar presentes:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar presentes'
        });
    }
}

/**
 * Cria novo presente
 */
async function createGift(req, res) {
    try {
        // Trata erros do multer
        if (req.fileValidationError) {
            return res.status(400).json({
                success: false,
                message: req.fileValidationError
            });
        }
        
        // Processa dados do formulário (pode vir como JSON ou FormData)
        let giftData;
        if (req.body.data) {
            // Se veio como FormData com campo 'data' (JSON string)
            try {
                const parsedData = typeof req.body.data === 'string' ? JSON.parse(req.body.data) : req.body.data;
                giftData = {
                    name: parsedData.name || '',
                    category: parsedData.category || '',
                    description: parsedData.description || '',
                    product_link: parsedData.product_link || null,
                    image_url: parsedData.image_url || null
                };
            } catch (error) {
                console.error('Erro ao fazer parse do campo data:', error);
                // Se não conseguir fazer parse, tenta usar req.body diretamente
                giftData = {
                    name: req.body.name || '',
                    category: req.body.category || '',
                    description: req.body.description || '',
                    product_link: req.body.product_link || null,
                    image_url: req.body.image_url || null
                };
            }
        } else if (req.body.name || req.body.category || req.body.description) {
            // Se veio como FormData direto (campos individuais)
            giftData = {
                name: req.body.name || '',
                category: req.body.category || '',
                description: req.body.description || '',
                product_link: req.body.product_link || null,
                image_url: req.body.image_url || null
            };
        } else {
            // Se veio como JSON
            giftData = req.body;
        }
        
        // Garante que os campos obrigatórios existam e sejam strings
        giftData.name = (giftData.name && typeof giftData.name === 'string') ? giftData.name.trim() : '';
        giftData.category = (giftData.category && typeof giftData.category === 'string') ? giftData.category.trim() : '';
        giftData.description = (giftData.description && typeof giftData.description === 'string') ? giftData.description.trim() : '';
        
        // Se há arquivo de imagem enviado, usa o arquivo
        let imageUrl = null;
        if (req.file) {
            // Gera URL relativa para a imagem
            imageUrl = `/uploads/images/${req.file.filename}`;
        } else if (giftData.image_url && typeof giftData.image_url === 'string' && giftData.image_url.trim()) {
            // Se não há arquivo mas há URL, usa a URL
            imageUrl = giftData.image_url.trim();
        }
        
        // Valida dados (sem validar URL de imagem se houver arquivo)
        const validationData = { ...giftData };
        if (req.file) {
            validationData.image_url = null; // Remove URL para validação se há arquivo
        }
        const errors = Gift.validate(validationData);
        if (errors.length > 0) {
            // Remove arquivo se houver erro de validação
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(400).json({
                success: false,
                message: errors.join(', ')
            });
        }
        
        // Sanitiza dados
        const sanitizedData = {
            name: giftData.name.substring(0, 200),
            category: giftData.category.substring(0, 50),
            description: giftData.description.substring(0, 500),
            product_link: (giftData.product_link && typeof giftData.product_link === 'string') ? giftData.product_link.trim() : null,
            image_url: imageUrl
        };
        
        const gift = await Gift.create(sanitizedData);
        
        res.status(201).json({
            success: true,
            message: 'Presente criado com sucesso',
            gift
        });
    } catch (error) {
        // Remove arquivo em caso de erro
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        console.error('Erro ao criar presente:', error);
        
        if (error.message && error.message.includes('Tipo de arquivo')) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Erro ao criar presente'
        });
    }
}

/**
 * Atualiza presente
 */
async function updateGift(req, res) {
    try {
        // Trata erros do multer
        if (req.fileValidationError) {
            return res.status(400).json({
                success: false,
                message: req.fileValidationError
            });
        }
        
        const { id } = req.params;
        
        // Verifica se presente existe
        const existingGift = await Gift.findById(id);
        if (!existingGift) {
            // Remove arquivo se presente não existe
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(404).json({
                success: false,
                message: 'Presente não encontrado'
            });
        }
        
        // Processa dados do formulário
        let giftData;
        if (req.body.data) {
            // Se veio como FormData com campo 'data' (JSON string)
            try {
                const parsedData = typeof req.body.data === 'string' ? JSON.parse(req.body.data) : req.body.data;
                giftData = {
                    name: parsedData.name,
                    category: parsedData.category,
                    description: parsedData.description,
                    product_link: parsedData.product_link,
                    image_url: parsedData.image_url
                };
            } catch (error) {
                console.error('Erro ao fazer parse do campo data:', error);
                // Se não conseguir fazer parse, tenta usar req.body diretamente
                giftData = {
                    name: req.body.name,
                    category: req.body.category,
                    description: req.body.description,
                    product_link: req.body.product_link,
                    image_url: req.body.image_url
                };
            }
        } else if (req.body.name !== undefined || req.body.category !== undefined || req.body.description !== undefined) {
            // Se veio como FormData direto (campos individuais)
            giftData = {
                name: req.body.name,
                category: req.body.category,
                description: req.body.description,
                product_link: req.body.product_link,
                image_url: req.body.image_url
            };
        } else {
            // Se veio como JSON
            giftData = req.body;
        }
        
        // Processa campos: sempre usa os valores fornecidos, mas se vierem vazios, mantém os existentes
        // Isso permite que o usuário salve sem alterações
        if (giftData.name === undefined || giftData.name === null) {
            giftData.name = existingGift.name;
        } else {
            const trimmedName = (typeof giftData.name === 'string') ? giftData.name.trim() : String(giftData.name);
            // Se o campo foi enviado mas está vazio, mantém o existente
            giftData.name = trimmedName || existingGift.name;
        }
        
        if (giftData.category === undefined || giftData.category === null) {
            giftData.category = existingGift.category;
        } else {
            const trimmedCategory = (typeof giftData.category === 'string') ? giftData.category.trim() : String(giftData.category);
            // Se o campo foi enviado mas está vazio, mantém o existente
            giftData.category = trimmedCategory || existingGift.category;
        }
        
        if (giftData.description === undefined || giftData.description === null) {
            giftData.description = existingGift.description;
        } else {
            const trimmedDescription = (typeof giftData.description === 'string') ? giftData.description.trim() : String(giftData.description);
            // Se o campo foi enviado mas está vazio, mantém o existente
            giftData.description = trimmedDescription || existingGift.description;
        }
        
        // Processa product_link: se não fornecido, mantém existente ou null
        if (giftData.product_link === undefined || giftData.product_link === null) {
            giftData.product_link = existingGift.product_link || null;
        } else if (typeof giftData.product_link === 'string' && giftData.product_link.trim() === '') {
            giftData.product_link = null;
        } else {
            giftData.product_link = (typeof giftData.product_link === 'string') ? giftData.product_link.trim() : giftData.product_link;
        }
        
        // Se há arquivo de imagem enviado, usa o arquivo
        let imageUrl = null;
        if (req.file) {
            // Remove imagem antiga se existir
            if (existingGift.image_url && existingGift.image_url.startsWith('/uploads/')) {
                const oldImagePath = path.join(__dirname, '../..', existingGift.image_url);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
            // Gera URL relativa para a nova imagem
            imageUrl = `/uploads/images/${req.file.filename}`;
        } else if (giftData.image_url && giftData.image_url.trim()) {
            // Se não há arquivo mas há URL, usa a URL
            imageUrl = giftData.image_url.trim();
        } else if (existingGift.image_url) {
            // Mantém a imagem existente se não foi alterada
            imageUrl = existingGift.image_url;
        }
        
        // Valida dados
        const validationData = { ...giftData };
        if (req.file) {
            validationData.image_url = null; // Remove URL para validação se houver arquivo
        }
        const errors = Gift.validate(validationData);
        if (errors.length > 0) {
            // Remove arquivo se houver erro de validação
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(400).json({
                success: false,
                message: errors.join(', ')
            });
        }
        
        // Sanitiza dados
        const sanitizedData = {
            name: giftData.name.trim().substring(0, 200),
            category: giftData.category.trim().substring(0, 50),
            description: giftData.description.trim().substring(0, 500),
            product_link: giftData.product_link ? giftData.product_link.trim() : null,
            image_url: imageUrl
        };
        
        const gift = await Gift.update(id, sanitizedData);
        
        res.json({
            success: true,
            message: 'Presente atualizado com sucesso',
            gift
        });
    } catch (error) {
        // Remove arquivo em caso de erro
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        console.error('Erro ao atualizar presente:', error);
        
        if (error.message && error.message.includes('Tipo de arquivo')) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Erro ao atualizar presente'
        });
    }
}

/**
 * Remove presente (permite remover mesmo se reservado - uso administrativo)
 */
async function deleteGift(req, res) {
    try {
        const { id } = req.params;
        
        // Verifica se presente existe
        const existingGift = await Gift.findById(id);
        if (!existingGift) {
            return res.status(404).json({
                success: false,
                message: 'Presente não encontrado'
            });
        }
        
        // Remove imagem se existir
        if (existingGift.image_url && existingGift.image_url.startsWith('/uploads/')) {
            const imagePath = path.join(__dirname, '../..', existingGift.image_url);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }
        
        await Gift.delete(id);
        
        res.json({
            success: true,
            message: 'Presente removido com sucesso'
        });
    } catch (error) {
        console.error('Erro ao remover presente:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao remover presente'
        });
    }
}

/**
 * Atualiza status do presente (reservar/liberar)
 */
async function updateGiftStatus(req, res) {
    try {
        const { id } = req.params;
        const { status, reserved_by } = req.body;
        
        // Valida status
        if (!['available', 'reserved'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Status inválido. Use "available" ou "reserved"'
            });
        }
        
        // Verifica se presente existe
        const existingGift = await Gift.findById(id);
        if (!existingGift) {
            return res.status(404).json({
                success: false,
                message: 'Presente não encontrado'
            });
        }
        
        // Valida nome se estiver reservando
        if (status === 'reserved' && (!reserved_by || reserved_by.trim().length < 3)) {
            return res.status(400).json({
                success: false,
                message: 'Nome da pessoa é obrigatório e deve ter pelo menos 3 caracteres'
            });
        }
        
        const gift = await Gift.updateStatus(id, status, status === 'reserved' ? reserved_by.trim() : null);
        
        res.json({
            success: true,
            message: status === 'reserved' ? 'Presente marcado como reservado' : 'Presente liberado',
            gift
        });
    } catch (error) {
        console.error('Erro ao atualizar status:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao atualizar status do presente'
        });
    }
}

/**
 * Atualiza nome da pessoa que reservou
 */
async function updateReservedBy(req, res) {
    try {
        const { id } = req.params;
        const { reserved_by } = req.body;
        
        // Verifica se presente existe
        const existingGift = await Gift.findById(id);
        if (!existingGift) {
            return res.status(404).json({
                success: false,
                message: 'Presente não encontrado'
            });
        }
        
        // Verifica se está reservado
        if (existingGift.status !== 'reserved') {
            return res.status(400).json({
                success: false,
                message: 'Apenas presentes reservados podem ter o nome atualizado'
            });
        }
        
        // Se reserved_by for vazio ou null, remove o nome
        if (!reserved_by || !reserved_by.trim()) {
            const gift = await Gift.updateReservedBy(id, null);
            return res.json({
                success: true,
                message: 'Nome removido com sucesso',
                gift
            });
        }
        
        // Valida nome
        if (reserved_by.trim().length < 3) {
            return res.status(400).json({
                success: false,
                message: 'Nome deve ter pelo menos 3 caracteres'
            });
        }
        
        const gift = await Gift.updateReservedBy(id, reserved_by.trim());
        
        res.json({
            success: true,
            message: 'Nome atualizado com sucesso',
            gift
        });
    } catch (error) {
        console.error('Erro ao atualizar nome:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao atualizar nome'
        });
    }
}

module.exports = {
    login,
    getGifts,
    createGift,
    updateGift,
    deleteGift,
    updateGiftStatus,
    updateReservedBy
};
