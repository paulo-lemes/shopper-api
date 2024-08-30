# Shopper API

![GitHub repo size](https://img.shields.io/github/repo-size/paulo-lemes/shopper-api?style=for-the-badge)
![GitHub language count](https://img.shields.io/github/languages/count/paulo-lemes/shopper-api?style=for-the-badge)
![GitHub forks](https://img.shields.io/github/forks/paulo-lemes/shopper-api?style=for-the-badge)
![Bitbucket open issues](https://img.shields.io/bitbucket/issues/paulo-lemes/shopper-api?style=for-the-badge)

> Projeto realizado sob as diretrizes de desafio da empresa Shopper: back-end de um serviço de leitura de imagens, com 3 três endpoints e uma integração com a API do Google Gemini.

## 💻 Tecnologias Utilizadas

- Node.js
- Typescript
- Fastify
- Prisma
- Postgres
- Zod
- Jest
- Google: GenerativeAI, AIFileManager
- Docker

## Como Rodar o Projeto

Para rodar o projeto localmente, siga estas etapas:

1. Certifique-se de ter o Node.js instalado em seu sistema. Você pode fazer o download e instalá-lo [aqui](https://nodejs.org/).

2. Comece clonando este repositório para sua máquina local. Abra o terminal e execute o seguinte comando:

```bash
git clone https://github.com/paulo-lemes/shopper-api.git
```

3. Instale todas as dependências do projeto executando:

   ```bash
   npm install
   ```

4. Crie um arquivo .env contendo as variáveis de ambiente:

  - GEMINI_API_KEY="<chave_api>"
  - DATABASE_URL="postgresql://<user>:<password>@localhost:5432/<nome_db>"
  - POSTGRES_USER="<user>"
  - POSTGRES_PASSWORD="<password>"
  - POSTGRES_DB="<nome_db>"

  Para testes, adicionar também:
  - TEST_DATABASE_URL="postgresql://<user>:<password>@localhost:5432/<test_nome_db>"

5. Após a instalação, inicie o servidor de desenvolvimento executando:

   ```bash
   npm run dev
   ```
   
Para realizar o comando de testes, execute:

   ```bash
   npm run test
   ```


## Rodar o projeto através do Docker:

1. Certifique-se de ter o Docker instalado em seu sistema. Você pode fazer o download e instalá-lo [aqui](https://docs.docker.com/desktop/install/windows-install/) (link para windows). Verifique a documentação de acordo com seu sistema operacional. 

- Caso esteja utilizando linux, realize também o download do docker compose [aqui](https://docs.docker.com/compose/install/)

2. Faça o download do arquivo "docker-compose.yml".

3. Crie um arquivo .env contendo as variáveis de ambiente:

  - GEMINI_API_KEY="<chave_api>"
  - DATABASE_URL="postgresql://<user>:<password>@localhost:5432/<nome_db>"
  - POSTGRES_USER="<user>"
  - POSTGRES_PASSWORD="<password>"
  - POSTGRES_DB="<nome_db>"

4. Abra o terminal no diretório em que se encontra o arquivo docker-compose.yml e execute o seguinte comando:

   ```bash
   docker compose up -d
   ```

- flag "-d" opcional para modo detached

<div id="header" align="center">
 
 
#### Projeto realizado por Paulo Lemes
<br/>
 
  <a href="https://www.linkedin.com/in/-paulolemes/" target="_blank"><img src="https://img.shields.io/badge/-LinkedIn-%230077B5?style=for-the-badge&logo=linkedin&logoColor=white" target="_blank"></a> 
  <a href = "mailto:paulo-lemes@live.com"><img src="https://img.shields.io/badge/-Email-%23333?style=for-the-badge&logo=gmail&logoColor=white" target="_blank"></a>
   <a href="https://discordapp.com/users/430034249656172555" target="_blank">
  <img src="https://img.shields.io/badge/Discord-7289DA?style=for-the-badge&logo=discord&logoColor=white" alt="Discord Badge" width="">
</a>



</div>