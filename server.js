const http = require("http");
const fs = require("fs");
const path = require("path");

const port = Number(process.env.PORT || 4173);
const root = __dirname;
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".png": "image/png",
};

const server = http.createServer((req, res) => {
  const requestPath = decodeURIComponent(new URL(req.url, `http://localhost:${port}`).pathname);
  const filePath = path.resolve(root, `.${requestPath === "/" ? "/index.html" : requestPath}`);

  if (!filePath.startsWith(root)) {
    res.writeHead(403);
    res.end("Acesso negado");
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      res.writeHead(404);
      res.end("Arquivo nao encontrado");
      return;
    }

    res.writeHead(200, { "Content-Type": types[path.extname(filePath)] || "application/octet-stream" });
    res.end(data);
  });
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Gerador aberto em http://127.0.0.1:${port}`);
});
