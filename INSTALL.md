# 📦 Guia de Instalação Rápida

## Pré-requisitos

Certifique-se de ter instalado:
- ✅ Node.js (versão 14 ou superior)
- ✅ MySQL (versão 8 ou superior)
- ✅ npm (vem com Node.js)

## Passos Rápidos

### 1️⃣ Instalar Dependências
```bash
npm install
```

### 2️⃣ Criar Banco de Dados
Execute no MySQL:
```bash
mysql -u root -p < database/schema.sql
```

Ou copie e cole o conteúdo de `database/schema.sql` no seu cliente MySQL.

### 3️⃣ Configurar Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha_mysql_aqui
DB_NAME=lista_presentes
PORT=3000
NODE_ENV=development
JWT_SECRET=minha-chave-secreta-super-segura
```

**⚠️ IMPORTANTE:** Substitua `sua_senha_mysql_aqui` pela senha do seu MySQL!

### 4️⃣ Criar Senha Administrativa
```bash
node scripts/createAdmin.js
```

Digite a senha que deseja usar para acessar o painel administrativo.

### 5️⃣ Iniciar Servidor
```bash
npm start
```

Acesse: **http://localhost:3000**

## ✅ Pronto!

Agora você pode:
- Ver a lista de presentes em http://localhost:3000
- Clicar no botão ⚙️ para acessar o painel administrativo
- Adicionar, editar e gerenciar presentes

## 🆘 Problemas Comuns

### Erro: "Cannot connect to database"
- Verifique se o MySQL está rodando
- Confirme as credenciais no arquivo `.env`
- Certifique-se de que o banco `lista_presentes` existe

### Erro: "Admin não configurado"
- Execute: `node scripts/createAdmin.js`

### Porta 3000 já está em uso
- Altere a porta no arquivo `.env`: `PORT=3001`
- Ou pare o processo que está usando a porta 3000
