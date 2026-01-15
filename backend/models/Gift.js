const db = require('../config/database');

class Gift {
    /**
     * Busca todos os presentes
     */
    static async findAll() {
        const sql = `
            SELECT 
                id,
                name,
                category,
                description,
                product_link,
                image_url,
                status,
                reserved_by,
                reserved_at,
                created_at
            FROM gifts
            ORDER BY created_at DESC
        `;
        return await db.query(sql);
    }

    /**
     * Busca presente por ID
     */
    static async findById(id) {
        const sql = `
            SELECT 
                id,
                name,
                category,
                description,
                product_link,
                image_url,
                status,
                reserved_by,
                reserved_at,
                created_at
            FROM gifts
            WHERE id = ?
        `;
        const results = await db.query(sql, [id]);
        return results[0] || null;
    }

    /**
     * Cria um novo presente
     */
    static async create(giftData) {
        const sql = `
            INSERT INTO gifts (
                name,
                category,
                description,
                product_link,
                image_url,
                status
            ) VALUES (?, ?, ?, ?, ?, 'available')
        `;
        
        const params = [
            giftData.name,
            giftData.category,
            giftData.description,
            giftData.product_link || null,
            giftData.image_url || null
        ];
        
        const result = await db.query(sql, params);
        return await this.findById(result.insertId);
    }

    /**
     * Atualiza um presente
     */
    static async update(id, giftData) {
        const sql = `
            UPDATE gifts
            SET 
                name = ?,
                category = ?,
                description = ?,
                product_link = ?,
                image_url = ?
            WHERE id = ?
        `;
        
        const params = [
            giftData.name,
            giftData.category,
            giftData.description,
            giftData.product_link || null,
            giftData.image_url || null,
            id
        ];
        
        await db.query(sql, params);
        return await this.findById(id);
    }

    /**
     * Remove um presente
     */
    static async delete(id) {
        const sql = 'DELETE FROM gifts WHERE id = ?';
        await db.query(sql, [id]);
        return true;
    }

    /**
     * Atualiza status do presente (reservar/liberar)
     */
    static async updateStatus(id, status, reservedBy = null) {
        if (status === 'reserved') {
            const sql = `
                UPDATE gifts
                SET 
                    status = ?,
                    reserved_by = ?,
                    reserved_at = NOW()
                WHERE id = ?
            `;
            await db.query(sql, [status, reservedBy, id]);
        } else {
            const sql = `
                UPDATE gifts
                SET 
                    status = ?,
                    reserved_by = NULL,
                    reserved_at = NULL
                WHERE id = ?
            `;
            await db.query(sql, [status, id]);
        }
        return await this.findById(id);
    }

    /**
     * Atualiza apenas o nome da pessoa que reservou
     */
    static async updateReservedBy(id, reservedBy) {
        const sql = `
            UPDATE gifts
            SET reserved_by = ?
            WHERE id = ? AND status = 'reserved'
        `;
        
        await db.query(sql, [reservedBy, id]);
        return await this.findById(id);
    }

    /**
     * Reserva um presente (transação atômica)
     */
    static async reserve(giftId, guestName) {
        return await db.transaction(async (connection) => {
            // Verifica se o presente existe e está disponível
            const checkSql = 'SELECT id, status FROM gifts WHERE id = ? FOR UPDATE';
            const [gifts] = await connection.execute(checkSql, [giftId]);
            
            if (gifts.length === 0) {
                throw new Error('Presente não encontrado');
            }
            
            const gift = gifts[0];
            
            if (gift.status === 'reserved') {
                throw new Error('Este presente já foi reservado');
            }
            
            // Reserva o presente
            const updateSql = `
                UPDATE gifts
                SET 
                    status = 'reserved',
                    reserved_by = ?,
                    reserved_at = NOW()
                WHERE id = ?
            `;
            
            await connection.execute(updateSql, [guestName, giftId]);
            
            // Retorna o presente atualizado
            const [updated] = await connection.execute(
                'SELECT * FROM gifts WHERE id = ?',
                [giftId]
            );
            
            return updated[0];
        });
    }

    /**
     * Valida dados do presente
     */
    static validate(giftData) {
        const errors = [];
        
        if (!giftData.name || giftData.name.trim().length < 2) {
            errors.push('Nome do presente deve ter pelo menos 2 caracteres');
        }
        
        if (!giftData.category || giftData.category.trim().length === 0) {
            errors.push('Categoria é obrigatória');
        }
        
        if (!giftData.description || giftData.description.trim().length < 5) {
            errors.push('Descrição deve ter pelo menos 5 caracteres');
        }
        
        // Valida URL se fornecida
        if (giftData.product_link && giftData.product_link.trim()) {
            try {
                new URL(giftData.product_link);
            } catch {
                errors.push('Link do produto deve ser uma URL válida');
            }
        }
        
        if (giftData.image_url && giftData.image_url.trim()) {
            try {
                new URL(giftData.image_url);
            } catch {
                errors.push('URL da imagem deve ser uma URL válida');
            }
        }
        
        return errors;
    }
}

module.exports = Gift;
