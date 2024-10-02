const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const multer = require("multer");

const app = express();
const PORT = process.env.PORT || 4040;

const allowedOrigins = [];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.length > 0) {
      if (origin && allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    } else {
      callback(null, true);
    }
  },
};

app.use(cors(corsOptions));
app.use(express.json());

// Middleware para capturar erros de CORS
app.use((err, req, res, next) => {
  if (err instanceof Error && err.message === "Not allowed by CORS") {
    return res.status(403).json({ message: "Not allowed by CORS" });
  }
  next(err);
});

// Configuração do multer para upload de arquivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const subpasta = req.params.subpasta || "default"; // Define uma subpasta padrão
    const dir = path.join(__dirname, "uploads", subpasta);
    fs.mkdirSync(dir, { recursive: true }); // Cria a subpasta se não existir
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    // Manter o nome original do arquivo
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// Função para ler dados do JSON
const readData = () => {
  const data = fs.readFileSync("data.json");
  return JSON.parse(data);
};

// Função para escrever dados no JSON
const writeData = (data) => {
  fs.writeFileSync("data.json", JSON.stringify(data, null, 2));
};

// ----------- Funcionalidades da File API ----------

// 1. Upload de Arquivos
app.post("/files/:subpasta?", upload.single("file"), (req, res) => {
  res.json({ mensagem: "Arquivo enviado com sucesso!" });
});

// 2. Deletar Arquivo
app.delete("/files/:subpasta/:arquivo", (req, res) => {
  const subpasta = req.params.subpasta;
  const arquivo = req.params.arquivo;
  const filePath = path.join(__dirname, "uploads", subpasta, arquivo);

  fs.unlink(filePath, (err) => {
    if (err) {
      if (err.code === "ENOENT") {
        return res.status(404).json({
          mensagem: `Arquivo "${arquivo}" não encontrado na subpasta "${subpasta}".`,
        });
      }
      return res
        .status(500)
        .json({ mensagem: "Erro ao tentar deletar o arquivo." });
    }
    res.json({ mensagem: `Arquivo "${arquivo}" deletado com sucesso.` });
  });
});

// 3. Listar Pastas
app.get("/files", (req, res) => {
  const baseDir = path.join(__dirname, "uploads");

  fs.readdir(baseDir, { withFileTypes: true }, (err, files) => {
    if (err) {
      return res
        .status(500)
        .json({ mensagem: "Erro ao ler diretório de uploads." });
    }

    const folders = files
      .filter((file) => file.isDirectory())
      .map((folder) => folder.name);
    res.json({ pastas: folders });
  });
});

// 4. Listar Arquivos em Subpasta
app.get("/files/:subpasta", (req, res) => {
  const subpasta = req.params.subpasta;
  const dirPath = path.join(__dirname, "uploads", subpasta);

  fs.readdir(dirPath, { withFileTypes: true }, (err, files) => {
    if (err) {
      return res
        .status(500)
        .json({ mensagem: "Erro ao ler diretório de uploads." });
    }

    const fileDetails = files
      .filter((file) => file.isFile())
      .map((file) => {
        const filePath = path.join(dirPath, file.name);
        const stats = fs.statSync(filePath);
        return {
          nome: file.name,
          tamanho: stats.size,
          data: stats.mtime,
        };
      });

    res.json({ [subpasta]: fileDetails });
  });
});

// 5. Servir Arquivos Estáticos
app.use("/files", express.static(path.join(__dirname, "uploads")));

// ----------- Funcionalidades da Web API ----------

// Rota para obter todos os dados
app.get("/data", (req, res) => {
  const data = readData();
  res.json(data);
});

// Rota para obter recursos específicos
app.get("/data/:resource", (req, res) => {
  const data = readData();
  const resource = data[req.params.resource];

  if (resource) {
    res.json({ [req.params.resource]: resource });
  } else {
    res.json({ [req.params.resource]: [] }); // Retorna objeto com array vazio
  }
});

// Rota para obter um recurso específico por ID
app.get("/data/:resource/:id", (req, res) => {
  const data = readData();
  const resource = data[req.params.resource];

  if (resource) {
    const item = resource.find((i) => i.id === req.params.id);
    if (item) {
      res.json(item);
    } else {
      res.status(404).send("Item not found");
    }
  } else {
    res.status(404).send("Resource not found");
  }
});

// Rota para criar um novo recurso
app.post("/data/:resource", (req, res) => {
  const data = readData();
  const resource = data[req.params.resource];

  if (resource) {
    const newItem = {
      id: `${Date.now()}-${(Math.random() * 999).toFixed(0)}`,
      ...req.body,
    };
    resource.push(newItem);
    writeData(data);
    res.status(201).json(newItem);
  } else {
    res.status(404).send("Resource not found");
  }
});

// Rota para atualizar um recurso existente
app.put("/data/:resource/:id", (req, res) => {
  const data = readData();
  const resource = data[req.params.resource];

  if (resource) {
    const index = resource.findIndex((i) => i.id === req.params.id);
    if (index !== -1) {
      resource[index] = { id: req.params.id, ...req.body };
      writeData(data);
      res.json(resource[index]);
    } else {
      res.status(404).send("Item not found");
    }
  } else {
    res.status(404).send("Resource not found");
  }
});

// Rota para deletar um recurso
app.delete("/data/:resource/:id", (req, res) => {
  const data = readData();
  const resource = data[req.params.resource];

  if (resource) {
    const index = resource.findIndex((i) => i.id === req.params.id);
    if (index !== -1) {
      resource.splice(index, 1);
      writeData(data);
      res.status(204).send();
    } else {
      res.status(404).send("Item not found");
    }
  } else {
    res.status(404).send("Resource not found");
  }
});

// Função de filtragem, paginação, ordenação e busca
app.get("/data/:resource", (req, res) => {
  const data = readData();
  const resource = data[req.params.resource];

  if (resource) {
    let results = [...resource];

    // Filtragem
    if (req.query.nome) {
      results = results.filter((item) => item.nome.includes(req.query.nome));
    }

    // Paginação
    if (req.query._page && req.query._limit) {
      const page = parseInt(req.query._page);
      const limit = parseInt(req.query._limit);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      results = results.slice(startIndex, endIndex);
    }

    // Ordenação
    if (req.query._sort) {
      results.sort((a, b) => {
        if (req.query._order === "desc") {
          return a[req.query._sort] < b[req.query._sort] ? 1 : -1;
        }
        return a[req.query._sort] > b[req.query._sort] ? 1 : -1;
      });
    }

    // Busca global
    if (req.query.q) {
      results = results.filter((item) =>
        Object.values(item).some((value) =>
          value.toString().includes(req.query.q)
        )
      );
    }

    res.json(results);
  } else {
    res.status(404).send("Resource not found");
  }
});

// Rota inicial que exibe as URLs das APIs
app.get("/", (req, res) => {
  res.send(`
    <style>
    * {
    font-family: 'Arial', sans-serif;
    color: white;
    box-sizing: border-box;
    padding: 0;
    margin: 0;
    }
    body {
      background-color: #191622;
      height: 100vh;
      width: 100%;
      display: grid;
      place-items: center;
    }
      p {
      margin-top: 15px;
      }
    a {
      color: #ff79c6;
    }
    </style>
    <body>
      <div>
        <h1>File Hub API</h1>
        <p>File API: <a href="/files">/files</a></p>
        <p>Web API: <a href="/data">/data</a></p>
      </div>
    </body>
  `);
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
