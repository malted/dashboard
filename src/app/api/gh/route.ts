import { NextRequest, NextResponse } from "next/server";
import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 4221 });
wss.on("connection", (ws) => {
  console.log("Client connected", run);
  ws.send(JSON.stringify(run));
});

const run = [];

export async function POST(request: NextRequest) {
  const body = await request.json();

  const guid = request.headers.get("X-GitHub-Delivery");
  const event = request.headers.get("X-GitHub-Event");
  const action = body.action;
  const repo = body.repository?.name;
  const repoUrl = body.repository?.html_url;
  const sender = body.sender?.login;
  const senderAvatar = body.sender?.avatar_url;
  const timestampMs = Date.now();

  const info = {
    guid,
    event,
    action,
    repo,
    repoUrl,
    timestampMs,
    sender,
    senderAvatar,
  };
  run.push(info);

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify([info]));
    }
  });

  console.log("hi", body, info);

  return NextResponse.json({ ok: true }, { status: 200 });
}
