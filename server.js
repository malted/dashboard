import express from "express";
import next from "next";
import { parse } from "node:url";
import { WebSocketServer } from "ws";
import { webhooks } from "./src/app/data.js";

const app = express();

const nextApp = next({ dev: process.env.NODE_ENV !== "production" });
await nextApp.prepare();

app.use((req, res, next) => {
  nextApp.getRequestHandler()(req, res, parse(req.url, true));
});

const server = app.listen(3003);
const wss = new WebSocketServer({ noServer: true });

server.on("upgrade", (req, socket, head) => {
  const { pathname } = parse(req.url || "/", true);

  /**
   * Pass hot module reloading requests to Next.js
   */
  if (pathname === "/_next/webpack-hmr") {
    nextApp.getUpgradeHandler()(req, socket, head);
  }

  /**
   * Use another path for our custom WebSocket handler
   */
  if (pathname === "/api/ws") {
    console.log("incoming ws conn");
    wss.handleUpgrade(req, socket, head, (client) => {
      /**
       * `client` is a single unique WebSocket connection. Here we can subscribe
       * to backend events that we want to send to the client and handle
       * messages that the client sends to us.
       */
      client.send(JSON.stringify([webhooks]));

      client.on("message", (data, isBinary) => {
        console.log(data.toString());
      });
    });
  }
});
