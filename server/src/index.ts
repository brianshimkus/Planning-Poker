import { createServer } from "node:http";

const http = createServer((_req, res) => {
  res.writeHead(200);
  res.end("ok");
});

http.listen(Number(process.env.PORT ?? 8787), () => console.log("listening"));
