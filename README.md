# 🎁 Lista de Presentes - 15 Anos da Letícia

Sistema web completo e elegante para gerenciar lista de presentes de aniversário de 15 anos. Desenvolvido com interface moderna, responsiva e funcionalidades avançadas de gerenciamento.

## ✨ Características Principais

- 🎨 **Interface Moderna**: Design elegante com paleta de cores suave e tipografia profissional
- 📱 **Totalmente Responsivo**: Funciona perfeitamente em desktop, tablet e mobile
- 🔍 **Busca Inteligente**: Filtro em tempo real por nome, categoria ou descrição
- 📄 **Paginação**: Visualização organizada com 9 produtos por página e navegação por bullets
- 🖼️ **Upload de Imagens**: Sistema completo de upload e gerenciamento de imagens dos presentes
- 🔐 **Painel Administrativo**: Gerenciamento completo com autenticação segura
- 💳 **Seção PIX**: Área dedicada para recebimento de presentes via PIX com QR Code
- 📊 **Métricas em Tempo Real**: Acompanhamento de total, disponíveis e reservados

## 🚀 Tecnologias

### Frontend
- **HTML5** - Estrutura semântica
- **CSS3** - Estilização moderna com variáveis CSS e responsividade
- **JavaScript (ES6+)** - Lógica interativa e comunicação com API
- **Font Awesome** - Ícones profissionais
- **Google Fonts (Poppins)** - Tipografia elegante

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **MySQL2** - Driver para banco de dados MySQL
- **Multer** - Upload de arquivos (imagens)
- **bcryptjs** - Hash de senhas
- **jsonwebtoken** - Autenticação JWT
- **CORS** - Controle de acesso cross-origin
- **dotenv** - Gerenciamento de variáveis de ambiente

### Banco de Dados
- **MySQL** - Banco de dados relacional

## 📋 Pré-requisitos

- **Node.js** (versão 14 ou superior)
- **MySQL** (versão 8 ou superior)
- **npm** (vem com Node.js)

## 🔧 Instalação Passo a Passo

### 1. Clone o Repositório

```bash
git clone <url-do-repositorio>
cd "Lista de Presentes"
```

### 2. Instalar Dependências

```bash
npm install
```

### 3. Configurar Banco de Dados MySQL

**Opção A - Via linha de comando:**
```bash
mysql -u root -p < database/schema.sql
```

**Opção B - Via cliente MySQL (phpMyAdmin, MySQL Workbench, etc.):**
- Abra o arquivo `database/schema.sql`
- Execute todo o conteúdo no seu cliente MySQL

### 4. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Configurações do Banco de Dados
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha_mysql
DB_NAME=lista_presentes

# Configurações do Servidor
PORT=3000
NODE_ENV=development

# Chave secreta para JWT (recomendado alterar em produção)
JWT_SECRET=sua-chave-secreta-super-segura-aqui
```

**⚠️ IMPORTANTE:** Substitua `sua_senha_mysql` pela senha do seu MySQL!

### 5. Criar Diretório de Uploads

O sistema criará automaticamente o diretório `uploads/images/` na primeira execução, mas você pode criá-lo manualmente:

```bash
# Windows PowerShell
New-Item -ItemType Directory -Path "uploads\images" -Force

# Linux/Mac
mkdir -p uploads/images
```

### 6. Configurar Senha Administrativa

Execute o script para criar/atualizar a senha do administrador:

```bash
node scripts/createAdmin.js
```

O script irá solicitar uma senha. Esta será a senha usada para acessar o painel administrativo.

**Alternativa - Passar senha diretamente:**
```bash
node scripts/createAdmin.js minhaSenha123
```

**💡 Para alterar a senha posteriormente:** Execute o mesmo comando novamente com a nova senha.

### 7. Iniciar o Servidor

**Modo Desenvolvimento (com auto-reload):**
```bash
npm run dev
```

**Modo Produção:**
```bash
npm start
```

O servidor estará disponível em: **http://localhost:3000**

## 📁 Estrutura do Projeto

```
Lista de Presentes/
├── frontend/
│   ├── index.html          # Página principal
│   ├── css/
│   │   └── style.css      # Estilos completos e responsivos
│   ├── js/
│   │   └── app.js         # Lógica da aplicação
│   └── images/            # Imagens estáticas (QR Code PIX)
├── backend/
│   ├── server.js          # Servidor Express
│   ├── config/
│   │   └── database.js    # Configuração do banco de dados
│   ├── models/
│   │   ├── Gift.js        # Modelo de dados dos presentes
│   │   └── Admin.js       # Modelo de dados do administrador
│   ├── controllers/
│   │   ├── giftController.js    # Lógica de negócio dos presentes
│   │   └── adminController.js   # Lógica de negócio administrativa
│   ├── routes/
│   │   ├── giftRoutes.js  # Rotas públicas dos presentes
│   │   └── adminRoutes.js # Rotas administrativas
│   └── middleware/
│       ├── auth.js        # Autenticação JWT
│       └── upload.js      # Configuração do Multer
├── database/
│   └── schema.sql         # Schema do banco de dados
├── scripts/
│   └── createAdmin.js     # Script para criar/atualizar senha admin
├── uploads/
│   └── images/            # Imagens enviadas pelos administradores
├── .env                   # Variáveis de ambiente (criar manualmente)
├── .gitignore            # Arquivos ignorados pelo Git
├── nodemon.json          # Configuração do Nodemon
├── package.json          # Dependências do projeto
├── README.md             # Este arquivo
└── INSTALL.md            # Guia rápido de instalação
```

## 🎯 Funcionalidades

### 👥 Para Convidados

#### Visualização
- ✅ Visualizar lista completa de presentes em grid responsivo
- ✅ Ver métricas em tempo real (Total, Disponíveis, Escolhidos)
- ✅ Visualizar imagens dos presentes (upload ou URL externa)
- ✅ Ver informações detalhadas: nome, categoria, descrição
- ✅ Identificar presentes reservados visualmente

#### Busca e Navegação
- ✅ **Busca em tempo real** por nome, categoria ou descrição
- ✅ **Paginação** com 9 produtos por página
- ✅ **Navegação por bullets** (pontos indicadores)
- ✅ Mensagens informativas quando não há resultados

#### Reserva
- ✅ Escolher e reservar presentes disponíveis
- ✅ Informar nome ao reservar
- ✅ Acessar links diretos para compra (quando disponível)
- ✅ Ver confirmação visual após reserva

#### Seção PIX
- ✅ Visualizar QR Code para presente surpresa via PIX
- ✅ Área dedicada abaixo da lista de presentes

### 🔐 Para Administradores

#### Autenticação
- ✅ Login seguro com senha
- ✅ Toggle para mostrar/ocultar senha durante login
- ✅ Sessão persistente com JWT (24 horas)
- ✅ Logout automático ao fechar navegador

#### Gerenciamento de Presentes

**Criar Presente:**
- ✅ Adicionar nome, categoria (texto livre), descrição
- ✅ Upload de imagem (JPEG, PNG, GIF, WebP - até 5MB)
- ✅ Opcional: link do produto
- ✅ Preview da imagem antes de salvar
- ✅ Validação completa de dados

**Editar Presente:**
- ✅ Editar todas as informações do presente
- ✅ Trocar imagem (remove automaticamente a antiga)
- ✅ Manter imagem existente ou fazer novo upload

**Gerenciar Reservas:**
- ✅ Marcar presente como reservado manualmente
- ✅ Liberar presente reservado
- ✅ Editar nome da pessoa que reservou
- ✅ Visualizar data e hora da reserva

**Excluir Presente:**
- ✅ Excluir presentes (remove imagem do servidor)
- ✅ Confirmação antes de excluir

#### Interface Administrativa
- ✅ Lista completa de todos os presentes
- ✅ Visualização de status (Disponível/Reservado)
- ✅ Informações de reserva (quem e quando)
- ✅ Botões de ação organizados em grid 2x2 no mobile
- ✅ Modais customizados com estilo do sistema

### 🎨 Interface e Design

- ✅ Design moderno com paleta de cores suave (tons de rosa/bege)
- ✅ Tipografia profissional (Poppins + Snell Roundhand para nome)
- ✅ Ícones Font Awesome em toda a interface
- ✅ Animações suaves e transições
- ✅ Modais customizados (substituem alert/confirm nativos)
- ✅ Feedback visual em todas as ações
- ✅ Loading states durante requisições

### 📱 Responsividade

- ✅ **Desktop**: Layout em grid com múltiplas colunas
- ✅ **Tablet (768px)**: Ajustes de tamanho e espaçamento
- ✅ **Mobile (480px)**: Layout otimizado para telas pequenas
- ✅ Cards de métricas em 3 colunas no mobile
- ✅ Botões administrativos em grid 2x2 no mobile
- ✅ Navegação e menus adaptativos

## 🔒 Segurança

- ✅ **Autenticação JWT** para área administrativa
- ✅ **Hash de senhas** com bcrypt (10 rounds)
- ✅ **Reservas atômicas** (transações MySQL) - impede reservas simultâneas
- ✅ **Validação de dados** no frontend e backend
- ✅ **Sanitização** contra SQL Injection (prepared statements)
- ✅ **Escape de HTML** contra XSS
- ✅ **Validação de tipos de arquivo** no upload
- ✅ **Limite de tamanho** de arquivo (5MB)
- ✅ **CORS** configurado
- ✅ **Tratamento de erros** sem expor detalhes sensíveis

## 📡 API Endpoints

### Rotas Públicas

- `GET /api/gifts` - Lista todos os presentes
- `POST /api/reserve` - Reserva um presente

### Rotas Administrativas (requer autenticação)

- `POST /api/admin/login` - Login administrativo
- `GET /api/admin/gifts` - Lista presentes (admin)
- `POST /api/admin/gifts` - Cria novo presente (com upload de imagem)
- `PUT /api/admin/gifts/:id` - Atualiza presente (com upload de imagem)
- `DELETE /api/admin/gifts/:id` - Remove presente
- `PATCH /api/admin/gifts/:id/status` - Atualiza status (reservar/liberar)
- `PATCH /api/admin/gifts/:id/reserved-by` - Atualiza nome da pessoa que reservou

## 🎨 Personalização

### Alterar Senha Administrativa

```bash
node scripts/createAdmin.js
```

Ou passe a nova senha diretamente:
```bash
node scripts/createAdmin.js novaSenha123
```

### Alterar Porta do Servidor

Edite o arquivo `.env`:
```env
PORT=3001
```

### Adicionar QR Code PIX

1. Coloque a imagem do QR Code em: `frontend/images/qrcode-pix.png`
2. A imagem será exibida automaticamente na seção "Presente Surpresa"

## 🐛 Solução de Problemas

### Erro: "Cannot connect to database"
- ✅ Verifique se o MySQL está rodando
- ✅ Confirme as credenciais no arquivo `.env`
- ✅ Certifique-se de que o banco `lista_presentes` existe
- ✅ Execute o schema SQL novamente se necessário

### Erro: "Admin não configurado"
- ✅ Execute: `node scripts/createAdmin.js`
- ✅ Certifique-se de que o banco de dados está acessível

### Erro ao fazer upload de imagem
- ✅ Verifique se a pasta `uploads/images/` existe e tem permissões de escrita
- ✅ Confirme que o arquivo é uma imagem (JPEG, PNG, GIF ou WebP)
- ✅ Verifique se o tamanho não excede 5MB

### Porta 3000 já está em uso
- ✅ Altere a porta no arquivo `.env`: `PORT=3001`
- ✅ Ou pare o processo que está usando a porta 3000

### Mensagem de erro não aparece na busca
- ✅ Limpe o cache do navegador
- ✅ Verifique o console do navegador para erros JavaScript
- ✅ Certifique-se de que está usando a versão mais recente do código

### Imagens não aparecem
- ✅ Verifique se o servidor está rodando
- ✅ Confirme que a pasta `uploads/images/` existe
- ✅ Verifique as permissões da pasta
- ✅ Para URLs externas, confirme que são acessíveis

## 📝 Notas Importantes

### Banco de Dados

Se você já tem um banco de dados criado e precisa atualizar o schema (por exemplo, remover o campo `emoji`), execute:

```sql
ALTER TABLE gifts DROP COLUMN emoji;
```

Ou recrie o banco executando o `schema.sql` atualizado.

### Upload de Imagens

- As imagens são salvas em `uploads/images/`
- Nomes únicos são gerados automaticamente (timestamp + número aleatório)
- Imagens antigas são removidas automaticamente ao fazer upload de novas
- Tipos aceitos: JPEG, JPG, PNG, GIF, WebP
- Tamanho máximo: 5MB

### Paginação

- Exibe 9 produtos por página
- Bullets de paginação aparecem automaticamente quando há mais de 9 produtos
- A paginação se ajusta automaticamente aos resultados da busca

## 📚 Informações Essenciais para Deploy

Esta seção contém **todas as informações críticas** que você precisa saber antes de fazer o deploy do sistema em produção. Leia com atenção!

---

### 🔹 1. Arquivo Principal do Servidor

**Qual arquivo inicia o backend?**

✅ **Resposta:** `backend/server.js`

Este é o arquivo que inicia o servidor Express. Ele está localizado em:
```
backend/server.js
```

**Por que isso é importante?**
- Define o comando de start no `package.json`
- É o ponto de entrada da aplicação
- Precisa estar correto para o servidor iniciar

**Como verificar:**
Abra o `package.json` e confira:
```json
{
  "main": "backend/server.js",
  "scripts": {
    "start": "node backend/server.js",
    "dev": "nodemon backend/server.js"
  }
}
```

---

### 🔹 2. Comando de Instalação

**Qual comando usar para instalar dependências?**

✅ **Resposta:** `npm install`

**Comando padrão:**
```bash
npm install
```

**Alternativas (se você usar):**
- Yarn: `yarn install`
- PNPM: `pnpm install`

💡 **99% dos casos:** Use `npm install` (vem com Node.js)

**O que este comando faz?**
- Lê o arquivo `package.json`
- Baixa todas as dependências listadas
- Instala em `node_modules/`
- Cria `package-lock.json` (trava versões)

---

### 🔹 3. Comando de Start

**Como iniciar o servidor?**

✅ **Resposta:** `npm start`

**Comandos disponíveis:**

**Modo Produção:**
```bash
npm start
```
Este comando executa: `node backend/server.js`

**Modo Desenvolvimento (com auto-reload):**
```bash
npm run dev
```
Este comando executa: `nodemon backend/server.js`

**Ou diretamente:**
```bash
node backend/server.js
```

⚠️ **IMPORTANTE:** Teste localmente antes de fazer deploy:
```bash
npm install
npm start
```

Se funcionar localmente, funcionará na hospedagem!

---

### 🔹 4. Versão do Node.js

**Qual versão do Node.js usar?**

✅ **Recomendado:**
- **Node.js 18.x** (LTS)
- **Node.js 20.x** (LTS)

**Versões compatíveis:**
- Mínimo: Node.js 14.x
- Recomendado: Node.js 18.x ou 20.x

**Por que isso importa?**
- Express 4.x requer Node.js 14+
- MySQL2 requer Node.js 14+
- bcryptjs requer Node.js 12+
- jsonwebtoken requer Node.js 12+

**Como verificar sua versão:**
```bash
node --version
```

**Como escolher versão na Hostinger:**
- No painel da Hostinger, selecione Node.js 18 ou 20
- Evite versões muito antigas (10.x, 12.x)

---

### 🔹 5. Variáveis de Ambiente (CRÍTICO!)

**Quais variáveis o sistema precisa?**

✅ **Variáveis OBRIGATÓRIAS:**

```env
# Banco de Dados
DB_HOST=localhost              # Host do MySQL
DB_USER=root                  # Usuário do MySQL
DB_PASSWORD=sua_senha        # Senha do MySQL
DB_NAME=lista_presentes       # Nome do banco de dados

# Servidor
PORT=3000                     # Porta do servidor (Hostinger fornece)
NODE_ENV=production          # Ambiente (development ou production)

# Segurança
JWT_SECRET=chave-secreta-aleatoria-de-pelo-menos-32-caracteres
```

✅ **Variáveis OPCIONAIS:**

```env
# Performance
DB_CONNECTION_LIMIT=10       # Limite de conexões (padrão: 10)

# CORS (produção)
FRONTEND_URL=https://seusite.com.br  # Domínio do frontend
```

**📌 REGRAS IMPORTANTES:**

1. **NUNCA suba o `.env` no zip/Git**
   - O `.env` contém senhas e chaves secretas
   - Use `.env.example` como template
   - Configure as variáveis no painel da Hostinger

2. **Configure TODAS as variáveis no painel**
   - Hostinger permite configurar variáveis de ambiente
   - Cada variável deve ser cadastrada individualmente
   - Use exatamente os nomes acima (case-sensitive)

3. **Gere uma JWT_SECRET segura:**
   ```bash
   # No terminal (Linux/Mac)
   openssl rand -base64 32
   
   # Ou use um gerador online seguro
   ```

---

### 🔹 6. Banco de Dados MySQL

**Quais informações você precisa ter em mãos?**

✅ **Informações necessárias:**

| Campo | Exemplo | Onde encontrar |
|-------|---------|----------------|
| **Host** | `localhost` ou IP | Painel Hostinger → MySQL |
| **Usuário** | `u123456789` | Painel Hostinger → MySQL |
| **Senha** | `senha123` | Você criou ao criar o banco |
| **Nome do Banco** | `u123456789_lista` | Painel Hostinger → MySQL |
| **Porta** | `3306` | Geralmente padrão (3306) |

**📋 Checklist do Banco:**

- [ ] Banco de dados criado no painel da Hostinger
- [ ] Credenciais anotadas (host, usuário, senha, nome)
- [ ] Schema importado (`database/schema.sql`)
- [ ] Tabelas criadas (`gifts` e `admin`)
- [ ] Conexão testada

**Como importar o schema:**

**Opção A - Via phpMyAdmin:**
1. Acesse phpMyAdmin no painel Hostinger
2. Selecione seu banco de dados
3. Vá em **Importar**
4. Selecione `database/schema.sql`
5. Clique em **Executar**

**Opção B - Via SSH:**
```bash
mysql -u usuario -p nome_do_banco < database/schema.sql
```

**⚠️ IMPORTANTE:**
- O sistema **NÃO cria tabelas automaticamente**
- Você **DEVE importar** o `schema.sql` manualmente
- Sem o schema, o sistema não funcionará

---

### 🔹 7. Frontend: Como é Servido?

**Como o frontend é servido?**

✅ **Resposta:** Dentro do Express usando `express.static`

**Estrutura:**
```
frontend/
├── index.html      ← Página principal
├── css/
│   └── style.css
├── js/
│   └── app.js
└── images/
    └── qrcode-pix.png
```

**Como funciona:**
- O Express serve os arquivos estáticos da pasta `frontend/`
- A rota `/` serve o `index.html`
- Arquivos CSS, JS e imagens são servidos automaticamente
- Não precisa de servidor web separado

**Código no `server.js`:**
```javascript
// Serve arquivos estáticos do frontend
app.use(express.static(frontendPath));

// Rota raiz serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});
```

**✅ Resumo:**
- Frontend está **dentro do Express**
- Não precisa de outro domínio
- Tudo funciona em uma única aplicação Node.js

---

### 🔹 8. CORS (Muito Esquecido!)

**Qual domínio vai acessar a API?**

✅ **Configuração:**

**Em desenvolvimento:**
```javascript
// Permite todas as origens
origin: '*'
```

**Em produção:**
```javascript
// Permite apenas seu domínio
origin: process.env.FRONTEND_URL || 'https://seusite.com.br'
```

**Como configurar:**

1. **No `.env` (produção):**
   ```env
   FRONTEND_URL=https://seusite.com.br
   ```

2. **Ou deixe vazio** para permitir todas as origens:
   ```env
   # Se não definir, permite todas (*)
   ```

**⚠️ IMPORTANTE:**
- Se o frontend e backend estão no mesmo domínio, não precisa configurar CORS
- Se estiverem em domínios diferentes, configure `FRONTEND_URL`
- Em produção, é recomendado restringir para seu domínio específico

---

### 🔹 9. Uploads (Multer)

**Como funciona o sistema de upload?**

✅ **Informações importantes:**

**Estrutura de pastas:**
```
uploads/
└── images/          ← Imagens são salvas aqui
    └── .gitkeep    ← Mantém pasta no Git
```

**Configurações:**
- **Pasta:** `uploads/images/` (relativa ao projeto)
- **Tipos aceitos:** JPEG, JPG, PNG, GIF, WebP
- **Tamanho máximo:** 5MB por arquivo
- **Nomes únicos:** Gerados automaticamente (timestamp + aleatório)

**📋 Checklist de Upload:**

- [ ] Pasta `uploads/images/` existe no servidor
- [ ] Pasta tem permissão de escrita (chmod 755)
- [ ] Pasta está fora do Git (configurado no `.gitignore`)
- [ ] Caminho é relativo ao projeto (não absoluto)

**Como criar a pasta no servidor:**
```bash
mkdir -p uploads/images
chmod 755 uploads/images
```

**⚠️ IMPORTANTE:**
- A pasta **precisa existir** antes de fazer upload
- Precisa ter **permissão de escrita**
- Imagens antigas são **removidas automaticamente** ao fazer novo upload

---

### 🔹 10. Testes Obrigatórios ANTES de Subir

**O que você DEVE testar localmente?**

✅ **Checklist de Testes:**

**1. Instalação:**
```bash
npm install
```
- [ ] Instala sem erros
- [ ] Todas as dependências baixadas

**2. Inicialização:**
```bash
npm start
```
- [ ] Servidor inicia sem erros
- [ ] Conecta ao banco de dados
- [ ] Mostra mensagem de sucesso

**3. Funcionalidades:**
- [ ] Site carrega (`http://localhost:3000`)
- [ ] API responde (`http://localhost:3000/api/gifts`)
- [ ] Login administrativo funciona
- [ ] Upload de imagens funciona
- [ ] Reserva de presentes funciona
- [ ] Busca funciona
- [ ] Paginação funciona

**4. Variáveis de Ambiente:**
- [ ] Todas as variáveis configuradas no `.env`
- [ ] Banco de dados conecta corretamente
- [ ] Porta configurada corretamente

**⚠️ REGRA DE OURO:**
> **Se não funciona localmente, NÃO vai funcionar na Hostinger!**

Sempre teste tudo localmente antes de fazer deploy.

---

### 📋 Checklist Resumido (Print Mental)

**Antes de fazer upload para a Hostinger, você precisa saber:**

- [x] ✅ **Arquivo principal:** `backend/server.js`
- [x] ✅ **Comando de instalação:** `npm install`
- [x] ✅ **Comando de start:** `npm start`
- [x] ✅ **Versão do Node:** 18.x ou 20.x
- [x] ✅ **Variáveis de ambiente:** Todas configuradas
- [x] ✅ **Dados do banco MySQL:** Host, usuário, senha, nome
- [x] ✅ **Estrutura de frontend:** Dentro do Express (`/frontend`)
- [x] ✅ **Domínio que acessa:** Para configurar CORS (se necessário)
- [x] ✅ **Upload de arquivos:** Pasta `uploads/images/` com permissões

---

### 🚀 Dica Profissional

**Mesmo sem GitHub, crie um repositório local:**

```bash
# Inicializar Git local
git init

# Adicionar arquivos
git add .

# Commit inicial
git commit -m "Versão inicial"
```

**Por quê?**
- ✅ Ignora `.env` automaticamente (via `.gitignore`)
- ✅ Ignora `uploads/images/*` (via `.gitignore`)
- ✅ Histórico mínimo de mudanças
- ✅ Evita erros bobos ao fazer upload

**O que NÃO subir no Git:**
- `.env` (contém senhas)
- `node_modules/` (muito pesado)
- `uploads/images/*` (imagens dos usuários)
- Logs e arquivos temporários

---

## 🚀 Deploy em Produção

### Recomendações

1. **Variáveis de Ambiente:**
   - Altere `JWT_SECRET` para uma chave forte e única
   - Configure `NODE_ENV=production`
   - Use credenciais de banco de dados seguras

2. **Segurança:**
   - Configure HTTPS
   - Use um servidor web reverso (Nginx, Apache)
   - Configure firewall adequadamente
   - Faça backup regular do banco de dados

3. **Performance:**
   - Configure cache de imagens
   - Use CDN para assets estáticos
   - Configure compressão gzip

4. **Monitoramento:**
   - Configure logs de erro
   - Monitore uso de recursos
   - Configure alertas

## 📄 Licença

ISC

## 👨‍💻 Desenvolvido com

- ❤️ Para celebrar os 15 anos da Letícia
- 🎨 Design cuidadosamente pensado
- 💻 Código limpo e bem organizado
- 🔒 Segurança em primeiro lugar

---

**Versão:** 1.0.0  
**Última atualização:** Janeiro 2026
#   p r e s e n t e s l e l e 1 5  
 