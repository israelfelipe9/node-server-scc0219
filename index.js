const http = require("http");
const fs = require("fs").promises;
const path = require("path");
const url = require("url");

const server = http.createServer(async (request, response) => {
  console.log("request ", request.url);

  const parsedUrl = url.parse(request.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;

  if (pathname === "/random" && query.max) {
    const max = parseInt(query.max, 10);
    if (!isNaN(max)) {
      const randomNumber = Math.random() * max;
      const responseBody = JSON.stringify({ random: randomNumber });
      response.writeHead(200, { "Content-Type": "application/json" });
      response.end(responseBody);
      return;
    }
  }

  if (pathname === "/random") {
    const randomNumber = Math.random();
    const responseBody = JSON.stringify({ random: randomNumber });
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(responseBody);
  }

  let filePath = `.${request.url}`;
  console.log(filePath);
  if (filePath === "./") {
    filePath = "./index.html";
  }

  const extname = String(path.extname(filePath)).toLowerCase();
  const mimeTypes = {
    ".html": "text/html",
    ".js": "text/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpg",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".wav": "audio/wav",
    ".mp4": "video/mp4",
    ".woff": "application/font-woff",
    ".ttf": "application/font-ttf",
    ".eot": "application/vnd.ms-fontobject",
    ".otf": "application/font-otf",
    ".wasm": "application/wasm",
  };

  const contentType = mimeTypes[extname] || "application/octet-stream";

  try {
    const content = await fs.readFile(filePath, "utf-8");
    response.writeHead(200, { "Content-Type": contentType });
    response.end(content, "utf-8");
  } catch (error) {
    if (error.code === "ENOENT") {
      try {
        const content = await fs.readFile("./404.html", "utf-8");
        response.writeHead(404, { "Content-Type": "text/html" });
        response.end(content, "utf-8");
      } catch (error) {
        response.writeHead(500);
        response.end(
          `Sorry, check with the site admin for error: ${error.code}..\n`
        );
      }
    } else {
      response.writeHead(500);
      response.end(
        `Sorry, check with the site admin for error: ${error.code}..\n`
      );
    }
  }
});

server.listen(8125);
console.log("Server running at http://127.0.0.1:8125/");
