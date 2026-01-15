const bcrypt = require('bcryptjs');
const db = require('../config/database');

class Admin {
    /**
     * Busca admin por ID
     */
    static async findById(id) {
        const sql = 'SELECT * FROM admin WHERE id = ?';
        const results = await db.query(sql, [id]);
        return results[0] || null;
    }

    /**
     * Verifica senha do admin
     */
    static async verifyPassword(password) {
        const sql = 'SELECT * FROM admin LIMIT 1';
        const results = await db.query(sql);
        
        if (results.length === 0) {
            throw new Error('Admin não configurado');
        }
        
        const admin = results[0];
        const isValid = await bcrypt.compare(password, admin.password_hash);
        
        if (!isValid) {
            throw new Error('Senha incorreta');
        }
        
        return admin;
    }

    /**
     * Cria ou atualiza senha do admin
     */
    static async setPassword(password) {
        const hash = await bcrypt.hash(password, 10);
        
        // Verifica se já existe admin
        const existing = await db.query('SELECT id FROM admin LIMIT 1');
        
        if (existing.length > 0) {
            // Atualiza senha existente
            const sql = 'UPDATE admin SET password_hash = ? WHERE id = ?';
            await db.query(sql, [hash, existing[0].id]);
        } else {
            // Cria novo admin
            const sql = 'INSERT INTO admin (password_hash) VALUES (?)';
            await db.query(sql, [hash]);
        }
        
        return true;
    }

    /**
     * Gera hash de senha (para scripts de configuração)
     */
    static async hashPassword(password) {
        return await bcrypt.hash(password, 10);
    }
}

module.exports = Admin;
