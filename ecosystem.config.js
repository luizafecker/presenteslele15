/**
 * Configuração do PM2 para produção
 * 
 * Uso:
 *   pm2 start ecosystem.config.js
 *   pm2 save
 *   pm2 startup
 */

module.exports = {
  apps: [{
    name: 'lista-presentes',
    script: './backend/server.js',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    // Logs
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    // Auto-restart
    autorestart: true,
    watch: false, // Desabilitado em produção
    max_memory_restart: '500M',
    // Outras configurações
    min_uptime: '10s',
    max_restarts: 10,
    restart_delay: 4000
  }]
};
