import { createServer, IncomingMessage, ServerResponse } from "node:http";
import next from "next";
import { Server } from "socket.io";
import { jwtVerify } from "jose";
import { parse as parseUrl } from "url";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

// Set environment variables to help with Server Actions in forwarded environments
if (dev) {
  process.env.NEXTAUTH_URL = process.env.NEXTAUTH_URL || `http://${hostname}:${port}`;
}

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

const JWT_SECRET = process.env.JWT_SECRET || '800e843c089c894982637213456789abcdef';
const secret = new TextEncoder().encode(JWT_SECRET);

// Store online users: userId -> set of socketIds
const onlineUsers = new Map<string, Set<string>>();

// Middleware to rewrite origin header for forwarded requests
function rewriteOriginHeaderMiddleware(req: IncomingMessage, res: ServerResponse, next: (err?: Error) => void) {
  if (req.headers['x-forwarded-host'] && req.method === 'POST') {
    const originalOrigin = req.headers['origin'];
    // If origin is localhost but we're behind a proxy, rewrite it
    if (originalOrigin?.includes('localhost')) {
      const protocol = req.headers['x-forwarded-proto'] || 'https';
      const host = req.headers['x-forwarded-host'];
      const port_str = req.headers['x-forwarded-port'];
      const newOrigin = `${protocol}://${host}${port_str ? `:${port_str}` : ''}`;
      req.headers['origin'] = newOrigin;
    }
  }
  next();
}

app.prepare().then(() => {
  const httpServer = createServer((req: IncomingMessage, res: ServerResponse) => {
    // Apply header rewriting middleware
    rewriteOriginHeaderMiddleware(req, res, () => {
      handler(req, res);
    });
  });
  
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

    // Add to online users
    if (!onlineUsers.has(userId)) {
      onlineUsers.set(userId, new Set());
    }
    onlineUsers.get(userId)?.add(socket.id);

    // Broadcast updated online users list
    io.emit("user-status-update", Array.from(onlineUsers.keys()));

    socket.on("join-conversation", (conversationId) => {
      socket.join(conversationId);
    });

    socket.on("send-message", (data) => {
      // Broadcast to specific conversation room
      socket.to(data.conversationId).emit("receive-message", data);
    });

    socket.on("disconnect", () => {
      const userSockets = onlineUsers.get(userId);
      if (userSockets) {
        userSockets.delete(socket.id);
        if (userSockets.size === 0) {
          onlineUsers.delete(userId);
        }
      }
      io.emit("user-status-update", Array.from(onlineUsers.keys()));
    });
  });

  httpServer.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
