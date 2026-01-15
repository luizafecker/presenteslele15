# 🚀 Guia de Deploy para Produção - Hostinger

Este guia contém todas as informações necessárias para fazer o deploy do sistema na Hostinger ou qualquer outra hospedagem Node.js.

## 📋 Pré-requisitos

- ✅ Conta na Hostinger com hospedagem Node.js ativada
- ✅ Banco de dados MySQL criado
- ✅ Acesso SSH ou painel de controle da Hostinger
- ✅ Node.js versão 14 ou superior disponível

## 🔧 Preparação Local

### 1. Instalar Dependências de Produção

```bash
npm install
```

Isso instalará todas as dependências, incluindo as novas de produção:
- `helmet` - Segurança HTTP headers
- `express-rate-limit` - Proteção contra abuso
- `compression` - Compressão de respostas

### 2. Testar Localmente em Modo Produção

```bash
# Configure NODE_ENV=production no .env
NODE_ENV=production

# Inicie o servidor
npm start
```

Teste todas as funcionalidades para garantir que tudo funciona corretamente.

### 3. Verificar Arquivos Sensíveis

Certifique-se de que o `.gitignore` está configurado corretamente e que arquivos sensíveis não serão commitados:

- ✅ `.env` está no `.gitignore`
- ✅ `node_modules/` está no `.gitignore`
- ✅ `uploads/images/*` está no `.gitignore` (exceto `.gitkeep`)

## 📦 Configuração na Hostinger

### 1. Criar Banco de Dados MySQL

1. Acesse o painel da Hostinger
2. Vá em **Banco de Dados MySQL**
3. Crie um novo banco de dados
4. Anote as credenciais:
   - Host (geralmente `localhost` ou um IP específico)
   - Usuário
   - Senha
   - Nome do banco

### 2. Importar Schema do Banco

**Opção A - Via phpMyAdmin:**
1. Acesse phpMyAdmin no painel da Hostinger
2. Selecione o banco de dados criado
3. Vá em **Importar**
4. Selecione o arquivo `database/schema.sql`
5. Clique em **Executar**

**Opção B - Via SSH:**
```bash
mysql -u usuario -p nome_do_banco < database/schema.sql
```

### 3. Configurar Variáveis de Ambiente

No painel da Hostinger, configure as variáveis de ambiente:

```env
DB_HOST=localhost
DB_USER=seu_usuario_mysql
DB_PASSWORD=sua_senha_mysql
DB_NAME=nome_do_banco
DB_CONNECTION_LIMIT=10
PORT=3000
NODE_ENV=production
JWT_SECRET=chave-secreta-aleatoria-de-pelo-menos-32-caracteres
FRONTEND_URL=https://seudominio.com.br
```

**⚠️ IMPORTANTE:**
- Gere uma `JWT_SECRET` segura: `openssl rand -base64 32`
- Use a porta fornecida pela Hostinger (geralmente 3000 ou outra)
- Configure `FRONTEND_URL` com seu domínio real

### 4. Upload dos Arquivos

**Opção A - Via Git (Recomendado):**
```bash
# No seu repositório Git
git add .
git commit -m "Preparação para produção"
git push origin main

# Na Hostinger, clone o repositório
git clone https://github.com/seu-usuario/seu-repositorio.git
cd seu-repositorio
npm install --production
```

**Opção B - Via FTP/SFTP:**
1. Conecte-se via FTP/SFTP
2. Faça upload de todos os arquivos (exceto `node_modules`)
3. Conecte-se via SSH e execute:
```bash
cd /caminho/do/projeto
npm install --production
```

### 5. Criar Diretório de Uploads

```bash
mkdir -p uploads/images
chmod 755 uploads/images
```

### 6. Configurar Senha Administrativa

```bash
node scripts/createAdmin.js suaSenhaSegura123
```

### 7. Configurar Process Manager (PM2 - Recomendado)

A Hostinger geralmente usa PM2 para gerenciar processos Node.js:

```bash
# Instalar PM2 globalmente (se ainda não estiver instalado)
npm install -g pm2

# Iniciar aplicação
pm2 start backend/server.js --name "lista-presentes"

# Salvar configuração
pm2 save

# Configurar para iniciar automaticamente
pm2 startup
```

**Arquivo `ecosystem.config.js` (Opcional):**
```javascript
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
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    max_memory_restart: '500M'
  }]
};
```

Iniciar com: `pm2 start ecosystem.config.js`

## ✅ Checklist de Deploy

### Antes do Deploy
- [ ] Todas as dependências instaladas (`npm install`)
- [ ] Arquivo `.env` configurado com valores de produção
- [ ] `JWT_SECRET` alterado para valor seguro
- [ ] Banco de dados criado e schema importado
- [ ] Senha administrativa configurada
- [ ] Testado localmente com `NODE_ENV=production`
- [ ] Verificado que não há `localhost:3000` hardcoded no código
- [ ] Diretório `uploads/images/` criado com permissões corretas

### Durante o Deploy
- [ ] Arquivos enviados para servidor
- [ ] Variáveis de ambiente configuradas no painel
- [ ] Dependências instaladas (`npm install --production`)
- [ ] Banco de dados conectado e testado
- [ ] Processo Node.js iniciado (PM2 ou outro)
- [ ] Porta configurada corretamente

### Após o Deploy
- [ ] Site acessível via URL
- [ ] API respondendo (`/api/gifts`)
- [ ] Login administrativo funcionando
- [ ] Upload de imagens funcionando
- [ ] Reserva de presentes funcionando
- [ ] Logs sendo gerados corretamente
- [ ] SSL/HTTPS configurado (recomendado)

## 🔒 Segurança em Produção

### Configurações Implementadas

✅ **Helmet** - Headers de segurança HTTP
✅ **Rate Limiting** - Proteção contra abuso (100 req/15min)
✅ **Rate Limiting Login** - Máximo 5 tentativas/15min
✅ **CORS** - Configurado para domínio específico
✅ **Compression** - Respostas comprimidas
✅ **JWT** - Autenticação segura
✅ **Bcrypt** - Hash de senhas
✅ **Validação** - Frontend e backend
✅ **SQL Injection** - Proteção via prepared statements

### Recomendações Adicionais

1. **SSL/HTTPS:**
   - Configure certificado SSL na Hostinger
   - Force HTTPS em todas as requisições

2. **Backup Regular:**
   - Configure backup automático do banco de dados
   - Faça backup dos uploads periodicamente

3. **Monitoramento:**
   - Configure logs estruturados
   - Monitore uso de recursos (CPU, memória)
   - Configure alertas para erros críticos

4. **Atualizações:**
   - Mantenha dependências atualizadas
   - Aplique patches de segurança regularmente

## 🐛 Troubleshooting

### Erro: "Cannot connect to database"
- Verifique credenciais no `.env`
- Confirme que o MySQL está rodando
- Verifique firewall/portas

### Erro: "Port already in use"
- Verifique qual processo está usando a porta
- Use outra porta ou pare o processo

### Imagens não aparecem
- Verifique permissões da pasta `uploads/images/`
- Confirme que o caminho está correto
- Verifique logs do servidor

### Rate limit muito restritivo
- Ajuste valores em `backend/server.js`:
  ```javascript
  max: 100, // Aumente se necessário
  ```

### Erro 404 em rotas do frontend
- Configure redirecionamento no servidor web (Nginx/Apache)
- Ou use a rota catch-all já implementada

## 📊 Monitoramento

### Logs

Os logs são exibidos no console. Em produção com PM2:

```bash
# Ver logs em tempo real
pm2 logs lista-presentes

# Ver apenas erros
pm2 logs lista-presentes --err

# Ver apenas output
pm2 logs lista-presentes --out
```

### Métricas

Monitore através do PM2:

```bash
# Status da aplicação
pm2 status

# Informações detalhadas
pm2 show lista-presentes

# Monitoramento em tempo real
pm2 monit
```

## 🔄 Atualizações Futuras

Para atualizar o sistema em produção:

1. Faça backup do banco de dados
2. Faça backup dos uploads
3. Atualize código via Git ou FTP
4. Execute `npm install --production`
5. Reinicie o processo: `pm2 restart lista-presentes`
6. Teste todas as funcionalidades

## 📞 Suporte

Em caso de problemas:

1. Verifique os logs: `pm2 logs lista-presentes`
2. Verifique variáveis de ambiente
3. Teste conexão com banco de dados
4. Verifique permissões de arquivos
5. Consulte documentação da Hostinger

---

**Última atualização:** Janeiro 2026  
**Versão:** 1.0.0
