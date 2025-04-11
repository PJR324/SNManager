# SNManager

[![Node.js](https://img.shields.io/badge/Node.js-v20.18.0-brightgreen?logo=node.js)](https://nodejs.org/)
[![Status](https://img.shields.io/badge/status-em%20desenvolvimento-blue)]

> Um gerenciador de redes sociais que reúne **Bluesky**, **YouTube** e **Twitch** em um único sistema.  
> Desenvolvido por **Pedro de Jesus** com apoio de um grupo de 4 integrantes

---

## ✨ Sobre o Projeto

O **SNManager** é um sistema web feito com **Node.js** que permite visualizar dados públicos de perfis nas redes sociais **YouTube**, **Twitch** e **Bluesky**, com um visual limpo e intuitivo.  
Ideal para criadores de conteúdo e curiosos digitais que querem monitorar suas contas de forma prática!

---

## 🚀 Tecnologias Utilizadas

- [Node.js v20.18.0](https://nodejs.org/)
- HTML, CSS e JavaScript (vanilla)
- Integração com APIs:
  - [YouTube Data API v3](https://developers.google.com/youtube/v3)
  - [Twitch API](https://dev.twitch.tv/docs/)
  - [ATProto API (Bluesky)](https://atproto.com/)

---

## 🧩 Funcionalidades

- Busca por perfis públicos no YouTube, Twitch e Bluesky  
- Exibição de dados básicos do perfil (imagem, nome, etc.)  
- Armazenamento temporário dos dados no navegador (`localStorage`)  
- Suporte à autenticação OAuth 2.0
- Planejamento para agendamento de publicações futuras (em desenvolvimento)

---

## 📁 Estrutura do Projeto

```
├── publico/         # Frontend (HTML, CSS, JS)
├── servidor/        # Backend com Node.js e integrações de API
├── package.json     # Dependências do projeto
├── .env             # Variáveis de ambiente (NÃO INCLUÍDO NO GIT)
```

---

## 🛠️ Como Rodar o Projeto

1. **Clone o repositório:**

```bash
git clone https://github.com/seu-usuario/snmanager.git
```

2. **Instale as dependências:**

```bash
cd snmanager
npm install
```

3. **Configure suas chaves de API:**

Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```env
SESSION_SECRET=seu_codigo_aqui
YOUTUBE_PUBLIC_KEY=sua_chave_aqui
YOUTUBE_CLIENT_ID=seu_client_aqui
YOUTUBE_CLIENT_SECRET=seu_client_secret_aqui
YOUTUBE_CLIENT_REDIRECT=seu_link_de_callback_aqui
TWITCH_CLIENT_ID=seu_client_aqui
TWITCH_CLIENT_SECRET=seu_client_secret_aqui
TWITCH_CLIENT_REDIRECT=seu_link_de_callback_aqui
```

> ⚠️ **As credenciais e chaves de API NÃO são incluídas neste repositório por segurança.**

4. **Execute o projeto:**

```bash
node servidor/server.js
```

5. **Acesse no navegador:**
[http://localhost:3000]

---

## 👨‍👩‍👧‍👦 Integrantes do Projeto

- **Pedro de Jesus**
- **Jeniffer da Silva**
- **Eduardo Matos**
- **Pietro Coimbra**
- **Brenda Rodrigues**

---
