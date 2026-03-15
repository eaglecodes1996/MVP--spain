import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';

import { connectDb } from './config/db.js';
import { aiRouter } from './routes/ai.js';
import { forumRouter } from './routes/forum.js';
import { supportRouter } from './routes/support.js';
import { subjectsRouter } from './routes/subjects.js';
import { registerSocketHandlers } from './sockets/index.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const clientDist = path.resolve(__dirname, '..', 'client', 'dist');

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: { origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173', credentials: true },
});

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '2mb' }));

app.use('/api/ai', aiRouter);
app.use('/api/forum', forumRouter);
app.use('/api/support', supportRouter);
app.use('/api/subjects', subjectsRouter);

app.get('/api/health', (_, res) => res.json({ ok: true }));

// Serve built client when present (build then run server)
if (existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get('*', (_, res) => res.sendFile(path.join(clientDist, 'index.html')));
  console.log('Serving built client from client/dist');
} else {
  console.warn('Client build not found at', clientDist);
  console.warn('Run "npm run build" from the project root, then restart the server.');
}

registerSocketHandlers(io);

const PORT = process.env.PORT || 3000;

connectDb()
  .then(() => {
    httpServer.listen(PORT, () => console.log(`SolveSnap server on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('DB connection failed:', err);
    process.exit(1);
  });

export { io };
