# 🚀 Guia: Como Subir o Projeto no GitHub

Este guia passo a passo vai te ajudar a fazer o primeiro commit e push do projeto para o GitHub.

---

## 📋 Pré-requisitos

- ✅ Conta no GitHub criada
- ✅ Git instalado no seu computador
- ✅ Projeto funcionando localmente

**Verificar se Git está instalado:**
```bash
git --version
```

Se não estiver instalado, baixe em: https://git-scm.com/downloads

---

## 🔧 Passo 1: Configurar Git (Primeira vez apenas)

Se você nunca usou Git neste computador, configure seu nome e email:

```bash
git config --global user.name "Seu Nome"
git config --global user.email "seu.email@exemplo.com"
```

**Verificar configuração:**
```bash
git config --global user.name
git config --global user.email
```

---

## 📦 Passo 2: Inicializar Repositório Git

No diretório do projeto, execute:

```bash
git init
```

Isso cria uma pasta `.git` oculta no projeto.

---

## ✅ Passo 3: Verificar Arquivos que Serão Commitados

**Ver o status atual:**
```bash
git status
```

Você verá:
- **Arquivos não rastreados** (em vermelho) - serão adicionados
- **Arquivos ignorados** (não aparecem) - protegidos pelo `.gitignore`

**⚠️ IMPORTANTE:** Verifique se arquivos sensíveis NÃO aparecem:
- ❌ `.env` (NÃO deve aparecer)
- ❌ `node_modules/` (NÃO deve aparecer)
- ❌ `uploads/images/*.png` (NÃO deve aparecer)
- ✅ `uploads/images/.gitkeep` (DEVE aparecer)

---

## 📝 Passo 4: Adicionar Arquivos ao Stage

**Adicionar TODOS os arquivos:**
```bash
git add .
```

**Ou adicionar arquivos específicos:**
```bash
git add README.md
git add package.json
git add backend/
git add frontend/
git add database/
# etc...
```

**Verificar o que foi adicionado:**
```bash
git status
```

Agora os arquivos devem aparecer em **verde** (staged).

---

## 💾 Passo 5: Fazer o Primeiro Commit

```bash
git commit -m "Initial commit: Sistema de Lista de Presentes - 15 Anos da Letícia"
```

**Ou com mensagem mais detalhada:**
```bash
git commit -m "Initial commit

- Sistema completo de lista de presentes
- Frontend responsivo com busca e paginação
- Painel administrativo com autenticação JWT
- Upload de imagens com Multer
- Banco de dados MySQL
- Pronto para produção"
```

**Verificar commits:**
```bash
git log
```

---

## 🌐 Passo 6: Criar Repositório no GitHub

1. Acesse: https://github.com
2. Faça login na sua conta
3. Clique no botão **"+"** no canto superior direito
4. Selecione **"New repository"**
5. Preencha:
   - **Repository name:** `lista-presentes-15-anos` (ou outro nome)
   - **Description:** `Sistema web completo para gerenciar lista de presentes de aniversário de 15 anos`
   - **Visibility:** Escolha **Public** ou **Private**
   - ❌ **NÃO marque** "Initialize with README" (já temos um)
   - ❌ **NÃO marque** "Add .gitignore" (já temos um)
   - ❌ **NÃO marque** "Choose a license" (já temos um)
6. Clique em **"Create repository"**

---

## 🔗 Passo 7: Conectar Repositório Local ao GitHub

Após criar o repositório, o GitHub mostrará instruções. Use a opção **"...or push an existing repository from the command line"**

**Copie a URL do repositório** (exemplo):
```
https://github.com/seu-usuario/lista-presentes-15-anos.git
```

**Adicionar remote:**
```bash
git remote add origin https://github.com/seu-usuario/lista-presentes-15-anos.git
```

**Verificar remote:**
```bash
git remote -v
```

---

## 🚀 Passo 8: Fazer Push para o GitHub

**Enviar código para o GitHub:**
```bash
git push -u origin main
```

Se sua branch padrão for `master` em vez de `main`:
```bash
git branch -M main
git push -u origin main
```

**Ou se for `master`:**
```bash
git push -u origin master
```

---

## ✅ Passo 9: Verificar no GitHub

1. Acesse seu repositório no GitHub
2. Verifique se todos os arquivos aparecem
3. Confirme que o README.md está sendo exibido
4. Verifique que arquivos sensíveis NÃO estão visíveis:
   - ❌ `.env` não deve aparecer
   - ❌ `node_modules/` não deve aparecer
   - ❌ Imagens em `uploads/images/` não devem aparecer

---

## 🔄 Próximos Commits (Trabalho Futuro)

Quando fizer alterações no projeto:

```bash
# 1. Ver o que mudou
git status

# 2. Adicionar arquivos modificados
git add .

# 3. Fazer commit
git commit -m "Descrição das mudanças"

# 4. Enviar para GitHub
git push
```

---

## 📋 Checklist Antes de Fazer Push

Antes de fazer `git push`, confirme:

- [ ] ✅ `.env` está no `.gitignore` e não aparece no `git status`
- [ ] ✅ `node_modules/` está ignorado
- [ ] ✅ Imagens em `uploads/images/` estão ignoradas (exceto `.gitkeep`)
- [ ] ✅ Não há senhas ou chaves secretas no código
- [ ] ✅ `README.md` está completo e atualizado
- [ ] ✅ `LICENSE` está presente
- [ ] ✅ `.gitignore` está configurado corretamente
- [ ] ✅ Todos os arquivos importantes estão incluídos

---

## 🛡️ Segurança: O que NUNCA deve ir para o GitHub

❌ **NUNCA commite:**

- `.env` (contém senhas e chaves secretas)
- `node_modules/` (muito pesado, pode ser reinstalado)
- Imagens de upload (`uploads/images/*.png`, `*.jpg`, etc.)
- Logs (`*.log`)
- Arquivos temporários
- Credenciais de banco de dados no código
- Chaves de API hardcoded

✅ **SEMPRE commite:**

- Código fonte (`.js`, `.html`, `.css`)
- `package.json` e `package-lock.json`
- `README.md`
- `.gitignore`
- `LICENSE`
- Arquivos de configuração (sem dados sensíveis)
- `database/schema.sql`
- `.gitkeep` (para manter pastas vazias)

---

## 🔧 Comandos Úteis do Git

**Ver histórico de commits:**
```bash
git log --oneline
```

**Ver diferenças antes de commitar:**
```bash
git diff
```

**Desfazer mudanças não commitadas:**
```bash
git checkout -- arquivo.js
```

**Ver branches:**
```bash
git branch
```

**Criar nova branch:**
```bash
git checkout -b nome-da-branch
```

**Voltar para branch main:**
```bash
git checkout main
```

---

## 🐛 Problemas Comuns

### Erro: "fatal: remote origin already exists"

**Solução:**
```bash
git remote remove origin
git remote add origin https://github.com/seu-usuario/repositorio.git
```

### Erro: "failed to push some refs"

**Solução:**
```bash
git pull origin main --rebase
git push -u origin main
```

### Arquivo sensível foi commitado por engano

**Solução:**
1. Adicione ao `.gitignore`
2. Remova do histórico:
```bash
git rm --cached arquivo.env
git commit -m "Remove arquivo sensível"
git push
```

---

## 📚 Recursos Adicionais

- **Documentação Git:** https://git-scm.com/doc
- **GitHub Guides:** https://guides.github.com
- **Git Cheat Sheet:** https://education.github.com/git-cheat-sheet-education.pdf

---

## ✅ Pronto!

Agora seu projeto está no GitHub! 🎉

**Lembre-se:**
- Faça commits frequentes com mensagens descritivas
- Nunca commite arquivos sensíveis
- Mantenha o README atualizado
- Use branches para features grandes

---

**Última atualização:** Janeiro 2026
