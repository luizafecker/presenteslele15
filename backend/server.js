const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const path = require('path');

// Carrega .env APENAS em desenvolvimento (se arquivo existir)
// Em produção na Hostinger, as variáveis vêm do painel, não do .env
if (process.env.NODE_ENV !== 'production') {
    try {
        require('dotenv').config();
    } catch (error) {
        // Ignora se dotenv não estiver disponível
    }
}

const db = require('./config/database');
const giftRoutes = require('./routes/giftRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const isProduction = NODE_ENV === 'production';

// ==================== SEGURANÇA ====================

// Helmet - Configuração de segurança HTTP headers
app.use(helmet({
    contentSecurityPolicy: isProduction ? undefined : false, // Desabilita em dev para facilitar debug
    crossOriginEmbedderPolicy: false // Permite imagens externas se necessário
}));

// CORS - Configuração para produção
const corsOptions = {
    origin: isProduction 
        ? process.env.FRONTEND_URL || '*' // Em produção, usar variável de ambiente ou permitir todas
        : '*', // Em desenvolvimento, permite todas as origens
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Rate Limiting - Proteção contra abuso
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: isProduction ? 100 : 1000, // Limite de requisições por IP
    message: {
        success: false,
        message: 'Muitas requisições deste IP. Tente novamente em alguns minutos.'
    },
    standardHeaders: true,
    legacyHeaders: false
});
app.use('/api', limiter);

// Rate Limiting mais restritivo para login administrativo
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, // Máximo 5 tentativas de login por IP a cada 15 minutos
    message: {
        success: false,
        message: 'Muitas tentativas de login. Tente novamente em 15 minutos.'
    },
    skipSuccessfulRequests: true
});

// ==================== PERFORMANCE ====================

// Compression - Comprime respostas HTTP
app.use(compression());

// ==================== PARSERS ====================

// Body parser
app.use(express.json({ limit: '10mb' })); // Limite de 10MB para JSON
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ==================== ARQUIVOS ESTÁTICOS ====================

// Servir arquivos estáticos do frontend
const frontendPath = path.join(__dirname, '../frontend');
app.use(express.static(frontendPath, {
    maxAge: isProduction ? '1y' : '0', // Cache em produção
    etag: true,
    lastModified: true
}));

// Servir arquivos de upload (imagens)
const uploadsPath = path.join(__dirname, '../uploads');
app.use('/uploads', express.static(uploadsPath, {
    maxAge: isProduction ? '1y' : '0',
    etag: true,
    lastModified: true
}));

// ==================== ROTAS ====================

// Rotas da API (devem vir ANTES do catch-all)
app.use('/api', giftRoutes);
app.use('/api/admin/login', loginLimiter, adminRoutes); // Rate limit no login
app.use('/api/admin', adminRoutes);

// Rota raiz - serve o index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Rota catch-all para SPA - DEVE vir DEPOIS de todas as rotas da API
// IMPORTANTE: Usa app.use em vez de app.get para capturar todos os métodos HTTP
app.use((req, res) => {
    // Se for uma rota de API não encontrada, retorna 404 JSON
    if (req.path.startsWith('/api')) {
        return res.status(404).json({
            success: false,
            message: 'Rota não encontrada'
        });
    }
    // Caso contrário, serve o index.html (para SPA)
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// ==================== TRATAMENTO DE ERROS ====================

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
    // Log do erro
    console.error('❌ Erro não tratado:', {
        message: err.message,
        stack: isProduction ? undefined : err.stack, // Não expor stack em produção
        path: req.path,
        method: req.method,
        timestamp: new Date().toISOString()
    });

    // Resposta de erro
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: isProduction 
            ? 'Erro interno do servidor' 
            : err.message || 'Erro interno do servidor',
        ...(isProduction ? {} : { stack: err.stack }) // Stack apenas em desenvolvimento
    });
});

// ==================== INICIALIZAÇÃO DO SERVIDOR ====================

async function startServer() {
    try {
        // Valida variáveis de ambiente críticas (mas não bloqueia se algumas estiverem faltando)
        const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
        const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
        
        if (missingVars.length > 0) {
            console.warn('⚠️ Algumas variáveis de ambiente não foram encontradas:');
            missingVars.forEach(varName => console.warn(`   - ${varName}`));
            console.warn('💡 Usando valores padrão. Configure as variáveis no painel da Hostinger.');
            console.warn('💡 Variáveis atuais:');
            console.warn(`   DB_HOST: ${process.env.DB_HOST || 'localhost (padrão)'}`);
            console.warn(`   DB_USER: ${process.env.DB_USER || 'root (padrão)'}`);
            console.warn(`   DB_NAME: ${process.env.DB_NAME || 'lista_presentes (padrão)'}`);
            console.warn(`   DB_PASSWORD: ${process.env.DB_PASSWORD ? '***configurada***' : 'NÃO CONFIGURADA'}`);
        }

        // Testa conexão com banco
        console.log('🔄 Testando conexão com banco de dados...');
        const dbConnected = await db.testConnection();
        
        if (!dbConnected) {
            console.error('❌ Não foi possível conectar ao banco de dados');
            console.error('Verifique as configurações no arquivo .env');
            process.exit(1);
        }

        // Inicia servidor
        app.listen(PORT, () => {
            console.log('\n' + '='.repeat(50));
            console.log('🚀 Servidor iniciado com sucesso!');
            console.log('='.repeat(50));
            console.log(`📦 Ambiente: ${NODE_ENV}`);
            console.log(`🌐 Servidor: http://localhost:${PORT}`);
            console.log(`📁 Frontend: http://localhost:${PORT}`);
            console.log(`🔌 API: http://localhost:${PORT}/api`);
            console.log('='.repeat(50) + '\n');
        });

        // Tratamento de erros não capturados
        process.on('unhandledRejection', (reason, promise) => {
            console.error('❌ Unhandled Rejection:', reason);
            // Em produção, pode querer registrar em serviço de logs
        });

        process.on('uncaughtException', (error) => {
            console.error('❌ Uncaught Exception:', error);
            process.exit(1);
        });

    } catch (error) {
        console.error('❌ Erro ao iniciar servidor:', error);
        process.exit(1);
    }
}

// Inicia servidor apenas se não estiver em modo de teste
if (require.main === module) {
    startServer();
}

module.exports = app;
