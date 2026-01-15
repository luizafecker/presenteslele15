/**
 * Script para criar/atualizar senha do administrador
 * 
 * Uso: node scripts/createAdmin.js [senha]
 */

require('dotenv').config();
const readline = require('readline');
const bcrypt = require('bcryptjs');
const path = require('path');

// Ajusta o caminho base para o diretório raiz do projeto

const db = require('../backend/config/database');


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

async function createAdmin() {
    try {
        console.log('🔐 Configuração de Senha Administrativa\n');
        
        let password;
        
        // Verifica se senha foi passada como argumento
        if (process.argv[2]) {
            password = process.argv[2];
        } else {
            // Solicita senha via terminal
            password = await question('Digite a senha administrativa: ');
            
            if (!password || password.length < 4) {
                console.error('❌ Senha deve ter pelo menos 4 caracteres');
                process.exit(1);
            }
            
            const confirmPassword = await question('Confirme a senha: ');
            
            if (password !== confirmPassword) {
                console.error('❌ Senhas não coincidem');
                process.exit(1);
            }
        }
        
        // Gera hash da senha
        console.log('\n⏳ Gerando hash da senha...');
        const hash = await bcrypt.hash(password, 10);
        
        // Verifica se já existe admin
        const existing = await db.query('SELECT id FROM admin LIMIT 1');
        
        if (existing.length > 0) {
            // Atualiza senha existente
            await db.query('UPDATE admin SET password_hash = ? WHERE id = ?', [
                hash,
                existing[0].id
            ]);
            console.log('✅ Senha administrativa atualizada com sucesso!');
        } else {
            // Cria novo admin
            await db.query('INSERT INTO admin (password_hash) VALUES (?)', [hash]);
            console.log('✅ Senha administrativa criada com sucesso!');
        }
        
        console.log('\n📝 Hash da senha (para referência):');
        console.log(hash);
        console.log('\n💡 Você pode usar este hash no arquivo .env se necessário');
        
    } catch (error) {
        console.error('❌ Erro ao configurar senha:', error.message);
        process.exit(1);
    } finally {
        rl.close();
        await db.pool.end();
    }
}

createAdmin();
