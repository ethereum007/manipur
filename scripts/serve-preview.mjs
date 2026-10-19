import http from "node:http";
import fs from "node:fs";
import path from "node:path";
const root = path.resolve("out");
http
  .createServer((req, res) => {
    let pathname = decodeURIComponent(
      new URL(req.url, "http://localhost").pathname,
    );
    if (pathname.startsWith("/manipur")) pathname = pathname.slice(8);
    let target = path.resolve(root, "." + pathname);
    if (!target.startsWith(root + path.sep) && target !== root) {
      res.writeHead(403);
      return res.end();
    }
    const choices = [target, path.join(target, "index.html"), target + ".html"];
    target =
      choices.find((p) => fs.existsSync(p) && fs.statSync(p).isFile()) ||
      target;
    if (!fs.existsSync(target)) {
      console.log("Missing route", pathname, target);
      res.writeHead(404);
      return res.end("Not found");
    }
    const types = {
      ".html": "text/html",
      ".js": "text/javascript",
      ".css": "text/css",
      ".json": "application/json",
      ".woff2": "font/woff2",
      ".jpg": "image/jpeg",
      ".png": "image/png",
      ".svg": "image/svg+xml",
      ".ico": "image/x-icon",
    };
    res.setHeader(
      "Content-Type",
      types[path.extname(target)] || "application/octet-stream",
    );
    fs.createReadStream(target).pipe(res);
  })
  .listen(3000, "127.0.0.1", () =>
    console.log("Preview: http://127.0.0.1:3000/manipur"),
  );
