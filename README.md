# SNManager

[![Node.js](https://img.shields.io/badge/Node.js-v20.18.0-brightgreen?logo=node.js)](https://nodejs.org/)
![Status](https://img.shields.io/badge/status-em%20desenvolvimento-blue)

> **PT-BR:** Um gerenciador de redes sociais que reúne **Bluesky**, **YouTube** e **Twitch** em um único sistema.  
> Desenvolvido por **Pedro de Jesus** com apoio de um grupo de 4 integrantes

> **EN:** A social network manager that integrates **Bluesky**, **YouTube**, and **Twitch** into a single system.
> Developed by **Pedro de Jesus** with the support of a 4-member team.

---

## ✨ Sobre o Projeto | About the Project

**PT-BR**

O **SNManager** é um sistema web feito com **Node.js** que permite visualizar dados públicos de perfis nas redes sociais **YouTube**, **Twitch** e **Bluesky**, com um visual limpo e intuitivo.  
Ideal para criadores de conteúdo e curiosos digitais que querem monitorar suas contas de forma prática!

**EN**

**SNManager** is a web system built with **Node.js** that allows users to view public profile data from **YouTube**, **Twitch**, and **Bluesky** in a clean and intuitive interface.
Perfect for content creators and digital enthusiasts who want to easily monitor their accounts!

---

## 🚀 Tecnologias Utilizadas | Technologies Used

- [Node.js v20.18.0](https://nodejs.org/)
- HTML, CSS & JavaScript (vanilla)
- API Integrations:
  - [YouTube Data API v3](https://developers.google.com/youtube/v3)
  - [Twitch API](https://dev.twitch.tv/docs/)
  - [ATProto API (Bluesky)](https://atproto.com/)

---

## 🧩 Funcionalidades | Features

**PT-BR**
- Busca por perfis públicos no YouTube, Twitch e Bluesky
- Exibição de dados básicos do perfil (imagem, nome, etc.)
- Armazenamento temporário dos dados no navegador (`localStorage`)
- Suporte à autenticação OAuth 2.0
- Agendamento de publicações futuras (em desenvolvimento)

**EN**
- Search for public profiles on YouTube, Twitch, and Bluesky
- Display of basic profile data (picture, name, etc.)
- Temporary data storage in the browser (`localStorage`)
- Support for OAuth 2.0 authentication
- Scheduling future posts (in development)
---

## 📁 Estrutura do Projeto | Project Structure

```
├── publico/         # Frontend (HTML, CSS, JS)
├── servidor/        # Backend with Node.js and API integrations
├── package.json     # Project dependencies
├── .env             # Environment variables (NOT INCLUDED IN GIT)
```

---

## 🛠️ Como Rodar o Projeto | How to Run the Project

1. **Clone o repositório | Clone the repository:**

```bash
git clone https://github.com/seu-usuario/snmanager.git
```

2. **Instale as dependências | Install the dependencies:**

```bash
cd snmanager
npm install
```

3. **Configure suas chaves de API | Set up your API keys:**

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
> ⚠️ **API credentials and keys are NOT included in this repository for security reasons.**

4. **Execute o projeto | Run the project:**

```bash
node servidor/server.js
```

5. **Acesse no navegador | Open in your browser:**
[http://localhost:3000]

---

## 👨‍👩‍👧‍👦 Integrantes do Projeto | Project Team

- **Pedro de Jesus**
- **Jeniffer da Silva**
- **Eduardo Matos**
- **Pietro Coimbra**
- **Brenda Rodrigues**

---