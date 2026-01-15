const mysql = require('mysql2/promise');

// Carrega .env APENAS em desenvolvimento (se arquivo existir)
// Em produção na Hostinger, as variáveis vêm do painel, não do .env
if (process.env.NODE_ENV !== 'production') {
    try {
        require('dotenv').config();
    } catch (error) {
        // Ignora se dotenv não estiver disponível
    }
}

// Valida variáveis de ambiente OBRIGATÓRIAS
const requiredEnvVars = {
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_NAME: process.env.DB_NAME
};

// Verifica se todas as variáveis obrigatórias estão presentes
const missingVars = Object.keys(requiredEnvVars).filter(key => !requiredEnvVars[key]);

if (missingVars.length > 0) {
    console.error('❌ ERRO CRÍTICO: Variáveis de ambiente obrigatórias não encontradas:');
    missingVars.forEach(varName => {
        console.error(`   - ${varName}`);
    });
    console.error('\n💡 Configure estas variáveis no painel da Hostinger:');
    console.error('   DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT (opcional)');
    throw new Error(`Variáveis de ambiente obrigatórias não configuradas: ${missingVars.join(', ')}`);
}

// Configuração da conexão com o banco de dados
// SEM FALLBACKS - usa APENAS variáveis de ambiente
const dbConfig = {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT) || 3306, // Porta MySQL (3306 é padrão)
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT) || 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    // Timeouts para produção
    connectTimeout: 60000, // 60 segundos
    acquireTimeout: 60000,
    timeout: 60000,
    // Reconexão automática
    reconnect: true,
    // Charset
    charset: 'utf8mb4'
};
  

// Pool de conexões
const pool = mysql.createPool(dbConfig);

/**
 * Testa a conexão com o banco de dados
 */
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        
        // Testa se consegue executar uma query simples
        await connection.query('SELECT 1');
        
        console.log('✅ Conexão com banco de dados estabelecida');
        console.log(`   Host: ${dbConfig.host}`);
        console.log(`   Port: ${dbConfig.port}`);
        console.log(`   Database: ${dbConfig.database}`);
        console.log(`   User: ${dbConfig.user}`);
        
        connection.release();
        return true;
    } catch (error) {
        console.error('❌ Erro ao conectar ao banco de dados:');
        console.error(`   Mensagem: ${error.message}`);
        console.error(`   Código: ${error.code}`);
        console.error(`   Host configurado: ${dbConfig.host}`);
        console.error(`   Port configurado: ${dbConfig.port}`);
        console.error(`   Database configurado: ${dbConfig.database}`);
        console.error(`   User configurado: ${dbConfig.user}`);
        return false;
    }
}

/**
 * Executa uma query
 */
async function query(sql, params = []) {
    try {
        const [results] = await pool.execute(sql, params);
        return results;
    } catch (error) {
        // Log detalhado do erro SQL para debug
        console.error('❌ Erro na query SQL:', {
            message: error.message,
            code: error.code,
            sqlState: error.sqlState,
            sqlMessage: error.sqlMessage,
            sql: sql.substring(0, 200), // Primeiros 200 caracteres da query
            params: params
        });
        throw error;
    }
}

/**
 * Executa uma transação
 */
async function transaction(callback) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    
    try {
        const result = await callback(connection);
        await connection.commit();
        return result;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

module.exports = {
    pool,
    query,
    transaction,
    testConnection
};
