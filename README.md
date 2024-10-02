# File API

Uma API para upload, listagem e exclusão de arquivos e gerenciamento de dados em um arquivo JSON. Esta API permite que você interaja com arquivos e recursos de forma simples e eficiente.

## Índice

- [Funcionalidades](#funcionalidades)
- [Instalação](#instalação)
- [Uso](#uso)
- [Rotas](#rotas)
- [Configuração de CORS](#configuração-de-cors)
- [Contribuição](#contribuição)

## Funcionalidades

- Upload de arquivos para subpastas
- Listar pastas e arquivos
- Deletar arquivos
- Gerenciar dados de recursos em um arquivo JSON (criar, ler, atualizar e deletar)

## Instalação

Para instalar e executar a API:

1. Clone o repositório:
   ```bash
   git clone https://github.com/joao-carmassi/File-Hub
   cd seurepositorio
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Crie um arquivo `data.json` vazio no diretório raiz do projeto.

4. Inicie o servidor:
   ```bash
   npm start
   ```

## Uso

A API estará disponível em `http://localhost:4040`. Você pode usar ferramentas como Postman ou cURL para fazer requisições.

## Rotas

### **Files API**

- **Upload de Arquivos**
  - `POST /files/:subpasta?`
    - Envia um arquivo para a subpasta especificada.

- **Deletar Arquivo**
  - `DELETE /files/:subpasta/:arquivo`
    - Deleta um arquivo da subpasta especificada.

- **Listar Pastas**
  - `GET /files`
    - Retorna uma lista de pastas.

- **Listar Arquivos em Subpasta**
  - `GET /files/:subpasta`
    - Retorna uma lista de arquivos na subpasta especificada.

- **Servir Arquivos Estáticos**
  - `GET /files/:subpasta/:arquivo`
    - Retorna o arquivo estático da subpasta especificada.

### **Web API**

- **Obter Todos os Dados**
  - `GET /data`
    - Retorna todos os dados do arquivo JSON.

- **Obter Recurso Específico**
  - `GET /data/:resource`
    - Retorna um recurso específico do arquivo JSON.

- **Obter Recurso por ID**
  - `GET /data/:resource/:id`
    - Retorna um recurso específico por ID.

- **Criar Novo Recurso**
  - `POST /data/:resource`
    - Cria um novo recurso.

- **Atualizar Recurso Existente**
  - `PUT /data/:resource/:id`
    - Atualiza um recurso existente.

- **Deletar Recurso**
  - `DELETE /data/:resource/:id`
    - Deleta um recurso.

- **Filtragem, Paginação, Ordenação e Busca**
  - `GET /data/:resource`
    - Permite filtragem, paginação, ordenação e busca de recursos.

## Configuração de CORS

A configuração de CORS está habilitada e pode ser ajustada na variável `allowedOrigins`. Adicione os domínios permitidos para fazer requisições à API.

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

---

Sinta-se à vontade para ajustar qualquer parte conforme necessário! :D