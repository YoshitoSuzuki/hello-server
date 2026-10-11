import { createServer } from "node:http";

const port = Number(process.env.PORT ?? 3000);

type Message = {
  text: string;
  time: string;
};

const server = createServer((req, res) => {
  if (req.url === "/api/hello") {
    const body: Message = { text: "Hello from TypeScript!", time: new Date().toISOString() };
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify(body));
    return;
  }
  res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("Not Found");
});

server.listen(port, () => {
  console.log(`listening on http://localhost:${port}`);
});
