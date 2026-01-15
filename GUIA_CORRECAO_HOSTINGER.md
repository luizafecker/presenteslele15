# 🔧 Guia de Correção - Erro 500 na Hostinger

## 📋 Problemas Identificados e Correções Aplicadas

### ✅ Correções no Código

1. **Tratamento de Variáveis de Ambiente**
   - ✅ Servidor não bloqueia mais se algumas variáveis estiverem faltando
   - ✅ Mostra avisos em vez de erros fatais
   - ✅ Usa valores padrão quando possível

2. **Melhor Diagnóstico de Conexão**
   - ✅ Logs detalhados mostram host, database e user configurados
   - ✅ Testa query simples na conexão

3. **Query SQL Mais Robusta**
   - ✅ Retorna array vazio se tabela não existir (em vez de erro)
   - ✅ Fallback automático para query simplificada
   - ✅ Logs claros sobre problemas de estrutura

4. **Endpoint de Health Check**
   - ✅ Nova rota `/api/health` para testar se API está funcionando

---

## 🔍 Verificações Necessárias na Hostinger

### 1. Variáveis de Ambiente (CRÍTICO!)

**No painel da Hostinger, verifique se TODAS estas variáveis estão configuradas:**

```
DB_HOST=localhost
DB_USER=seu_usuario_mysql
DB_PASSWORD=sua_senha_mysql
DB_NAME=nome_do_banco
NODE_ENV=production
PORT=3000
JWT_SECRET=chave-secreta-aleatoria-de-pelo-menos-32-caracteres
```

**Como verificar:**
1. Acesse o painel da Hostinger
2. Vá em **Configurações** ou **Variáveis de Ambiente**
3. Verifique se TODAS as variáveis acima estão presentes
4. **IMPORTANTE:** Os valores devem estar EXATAMENTE como acima (case-sensitive)

**⚠️ Problema comum:** 
- Variável `DB_DATABASE` em vez de `DB_NAME` → **CORRIJA para `DB_NAME`**
- Variável `DATABASE` em vez de `DB_NAME` → **CORRIJA para `DB_NAME`**

---

### 2. Banco de Dados MySQL

**Verifique se a tabela `gifts` existe:**

1. Acesse **phpMyAdmin** no painel da Hostinger
2. Selecione seu banco de dados
3. Verifique se existe a tabela `gifts`
4. Se NÃO existir:
   - Vá em **Importar**
   - Selecione o arquivo `database/schema.sql`
   - Clique em **Executar**

**Verifique a estrutura da tabela:**

Execute esta query no phpMyAdmin:
```sql
DESCRIBE gifts;
```

**Deve retornar estas colunas:**
- `id` (INT, PRIMARY KEY)
- `name` (VARCHAR(200))
- `category` (VARCHAR(50))
- `description` (TEXT)
- `product_link` (VARCHAR(500), NULL)
- `image_url` (VARCHAR(500), NULL)
- `status` (ENUM('available', 'reserved'))
- `reserved_by` (VARCHAR(100), NULL)
- `reserved_at` (DATETIME, NULL)
- `created_at` (DATETIME)
- `updated_at` (DATETIME)

**Se alguma coluna estiver faltando, execute o schema.sql novamente.**

---

### 3. Teste a API Diretamente

**Após fazer deploy, teste estas URLs:**

1. **Health Check:**
   ```
   https://seu-dominio.com/api/health
   ```
   Deve retornar:
   ```json
   {
     "success": true,
     "message": "API está funcionando",
     "timestamp": "2026-01-15T..."
   }
   ```

2. **Lista de Presentes:**
   ```
   https://seu-dominio.com/api/gifts
   ```
   Deve retornar:
   ```json
   {
     "success": true,
     "gifts": [...]
   }
   ```

**Se o health check funcionar mas `/api/gifts` não funcionar:**
- Problema está no banco de dados ou na query SQL
- Verifique os logs do servidor

---

### 4. Verificar Logs do Servidor

**Na Hostinger, acesse os logs da aplicação:**

1. Vá em **Logs** ou **Application Logs**
2. Procure por erros que começam com `❌`
3. Procure por avisos que começam com `⚠️`

**Logs importantes a procurar:**
- `❌ Erro ao conectar ao banco de dados` → Problema de conexão
- `❌ Tabela "gifts" não encontrada` → Tabela não existe
- `⚠️ Algumas variáveis de ambiente não foram encontradas` → Variáveis faltando
- `⚠️ Algumas colunas não existem no banco` → Estrutura diferente

---

## 🛠️ Passos de Correção Manual

### Passo 1: Verificar Variáveis de Ambiente

1. Acesse painel Hostinger → **Configurações** → **Variáveis de Ambiente**
2. Confirme que existem:
   - `DB_HOST`
   - `DB_USER`
   - `DB_PASSWORD`
   - `DB_NAME` (NÃO `DB_DATABASE`!)
   - `NODE_ENV=production`
   - `PORT=3000`
   - `JWT_SECRET`

### Passo 2: Verificar Banco de Dados

1. Acesse **phpMyAdmin**
2. Selecione seu banco de dados
3. Execute:
   ```sql
   SHOW TABLES;
   ```
4. Deve aparecer `gifts` e `admin`
5. Se não aparecer, importe `database/schema.sql`

### Passo 3: Testar Conexão

1. No phpMyAdmin, execute:
   ```sql
   SELECT COUNT(*) FROM gifts;
   ```
2. Se funcionar, a tabela existe e está acessível
3. Se der erro, a tabela não existe ou há problema de permissões

### Passo 4: Verificar Estrutura da Tabela

Execute no phpMyAdmin:
```sql
DESCRIBE gifts;
```

Compare com a estrutura esperada acima.

---

## 🧪 Teste Rápido

**Execute estes testes na ordem:**

1. ✅ Health Check: `https://seu-dominio.com/api/health`
2. ✅ Lista de Presentes: `https://seu-dominio.com/api/gifts`
3. ✅ Verificar logs do servidor
4. ✅ Verificar variáveis de ambiente
5. ✅ Verificar estrutura do banco

---

## 📞 Se Ainda Não Funcionar

**Coletar estas informações:**

1. **Logs do servidor** (últimas 50 linhas)
2. **Resultado do health check** (`/api/health`)
3. **Resultado da query** `DESCRIBE gifts;` no phpMyAdmin
4. **Lista de variáveis de ambiente** configuradas (sem valores, apenas nomes)
5. **Resultado de** `SHOW TABLES;` no phpMyAdmin

---

## ✅ Checklist Final

Antes de considerar resolvido, confirme:

- [ ] Health check (`/api/health`) retorna sucesso
- [ ] Variáveis de ambiente estão todas configuradas
- [ ] Tabela `gifts` existe no banco
- [ ] Estrutura da tabela está correta
- [ ] Logs não mostram erros críticos
- [ ] `/api/gifts` retorna JSON válido

---

**Última atualização:** Janeiro 2026
