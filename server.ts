import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import { jwtVerify } from "jose";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

const JWT_SECRET = process.env.JWT_SECRET || '800e843c089c894982637213456789abcdef';
const secret = new TextEncoder().encode(JWT_SECRET);

// Store online users
const onlineUsers = new Map();

app.prepare().then(() => {
  const httpServer = createServer(handler);
  const io = new Server(httpServer);

  io.use(async (socket, next) => {
    try {
      const cookie = socket.handshake.headers.cookie;
      if (!cookie) return next(new Error("Authentication error"));

      const token = cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
      if (!token) return next(new Error("Authentication error"));

      const { payload } = await jwtVerify(token, secret);
      (socket as any).userId = payload.userId;
      next();
    } catch (err) {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    const userId = (socket as any).userId;
    onlineUsers.set(userId, socket.id);
    io.emit("user-online", userId);

    socket.on("join-conversation", (conversationId) => {
      socket.join(conversationId);
    });

    socket.on("send-message", (data) => {
      io.to(data.conversationId).emit("receive-message", data);
    });

    socket.on("disconnect", () => {
      onlineUsers.delete(userId);
      io.emit("user-offline", userId);
    });
  });

  httpServer.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
