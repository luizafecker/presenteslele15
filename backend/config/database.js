const mysql = require('mysql2/promise');
require('dotenv').config();

// Configuração da conexão com o banco de dados
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'lista_presentes',
    waitForConnections: true,
    connectionLimit: process.env.DB_CONNECTION_LIMIT || 10,
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
        console.log('✅ Conexão com banco de dados estabelecida');
        connection.release();
        return true;
    } catch (error) {
        console.error('❌ Erro ao conectar ao banco de dados:', error.message);
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
        console.error('Erro na query:', error);
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
