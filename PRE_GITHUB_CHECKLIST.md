# ✅ Checklist: Antes de Subir no GitHub

Use este checklist para garantir que tudo está correto antes de fazer o primeiro commit e push.

---

## 🔒 Segurança

- [ ] ✅ Arquivo `.env` existe e está no `.gitignore`
- [ ] ✅ `.env` NÃO aparece quando executa `git status`
- [ ] ✅ Nenhuma senha ou chave secreta está hardcoded no código
- [ ] ✅ `JWT_SECRET` não está no código, apenas no `.env`
- [ ] ✅ Credenciais de banco de dados não estão no código

**Como verificar:**
```bash
git status
# .env NÃO deve aparecer na lista
```

---

## 📁 Arquivos e Pastas

- [ ] ✅ `node_modules/` está no `.gitignore`
- [ ] ✅ `node_modules/` NÃO aparece no `git status`
- [ ] ✅ Imagens em `uploads/images/` estão ignoradas
- [ ] ✅ Apenas `.gitkeep` aparece em `uploads/images/`
- [ ] ✅ `package-lock.json` NÃO está ignorado (é importante!)
- [ ] ✅ Logs (`*.log`) estão ignorados

**Como verificar:**
```bash
git status
# node_modules/ não deve aparecer
# uploads/images/*.png não deve aparecer
# uploads/images/.gitkeep DEVE aparecer
```

---

## 📄 Arquivos Essenciais

- [ ] ✅ `README.md` existe e está completo
- [ ] ✅ `LICENSE` existe
- [ ] ✅ `.gitignore` está configurado corretamente
- [ ] ✅ `.gitattributes` existe (criado automaticamente)
- [ ] ✅ `package.json` está presente
- [ ] ✅ `package-lock.json` está presente

---

## 🗄️ Banco de Dados

- [ ] ✅ `database/schema.sql` está presente
- [ ] ✅ Schema não contém dados sensíveis
- [ ] ✅ Apenas estrutura de tabelas, sem dados reais

---

## 📝 Documentação

- [ ] ✅ `README.md` tem todas as informações necessárias
- [ ] ✅ `INSTALL.md` existe (guia rápido)
- [ ] ✅ `PRODUCTION.md` existe (guia de deploy)
- [ ] ✅ `GITHUB.md` existe (guia de como subir no GitHub)
- [ ] ✅ `CHANGELOG_PRODUCTION.md` existe (se aplicável)

---

## 🧪 Testes Locais

- [ ] ✅ Projeto funciona localmente (`npm start`)
- [ ] ✅ Banco de dados conecta corretamente
- [ ] ✅ Todas as funcionalidades testadas
- [ ] ✅ Nenhum erro no console

---

## 📦 Dependências

- [ ] ✅ `package.json` tem todas as dependências corretas
- [ ] ✅ Versões das dependências estão definidas
- [ ] ✅ `package-lock.json` está presente e atualizado

**Como verificar:**
```bash
npm install
# Deve instalar sem erros
```

---

## 🎯 Estrutura do Projeto

- [ ] ✅ Pasta `backend/` com todos os arquivos
- [ ] ✅ Pasta `frontend/` com todos os arquivos
- [ ] ✅ Pasta `database/` com `schema.sql`
- [ ] ✅ Pasta `scripts/` com `createAdmin.js`
- [ ] ✅ Pasta `uploads/images/` existe (mesmo que vazia)

---

## 🔍 Verificação Final

**Execute estes comandos para verificar:**

```bash
# 1. Ver status do Git
git status

# 2. Ver o que será commitado
git add .
git status

# 3. Verificar se arquivos sensíveis não aparecem
# .env, node_modules, uploads/images/*.png NÃO devem aparecer

# 4. Ver estrutura de arquivos
ls -la
```

---

## ✅ Tudo Pronto?

Se todos os itens acima estão marcados:

1. ✅ Execute `git init` (se ainda não fez)
2. ✅ Execute `git add .`
3. ✅ Execute `git commit -m "Initial commit"`
4. ✅ Crie repositório no GitHub
5. ✅ Execute `git remote add origin <url>`
6. ✅ Execute `git push -u origin main`

**Consulte `GITHUB.md` para instruções detalhadas!**

---

## 🚨 Avisos Importantes

⚠️ **NUNCA faça push se:**
- `.env` aparece no `git status`
- Há senhas ou chaves no código
- `node_modules/` está sendo commitado
- Imagens de upload estão sendo commitadas

⚠️ **SEMPRE verifique:**
- `git status` antes de `git add`
- `git status` antes de `git commit`
- `git log` antes de `git push`

---

**Última atualização:** Janeiro 2026
