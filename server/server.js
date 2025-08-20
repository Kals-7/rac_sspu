import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import loki from 'lokijs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret_change_me';
const BOD_USERNAME = process.env.BOD_USERNAME || 'Vinayak';
const BOD_PASSWORD = process.env.BOD_PASSWORD || '123456';

app.use(helmet());
app.use(morgan('dev'));
app.use(cors({ origin: '*'}));
app.use(express.json({ limit: '256kb' }));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
app.use('/api/', limiter);

// Storage: LokiJS in-memory with persistence to file
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
const db = new loki(path.join(dataDir, 'db.json'), { autoload: true, autosave: true, autosaveInterval: 4000 });
let memberships;
db.loadDatabase({}, () => {
  memberships = db.getCollection('memberships') || db.addCollection('memberships', { indices: ['email'] });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

// Auth
const loginSchema = z.object({ username: z.string().min(1), password: z.string().min(1) });
app.post('/api/auth/login', (req, res) => {
  const parse = loginSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: 'Missing credentials' });
  const { username, password } = parse.data;
  const valid = username === BOD_USERNAME && password === BOD_PASSWORD;
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ sub: username, role: 'bod' }, JWT_SECRET, { expiresIn: '8h' });
  res.json({ token });
});

function verifyToken(req, res, next) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!token) return res.status(401).json({ error: 'Missing token' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// Memberships
const membershipSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email().max(180),
  interest: z.string().max(120).optional().default('')
});

app.post('/api/memberships', (req, res) => {
  const parsed = membershipSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid payload' });
  const { name, email, interest } = parsed.data;
  const item = { id: uuidv4(), name, email, interest, submittedAt: new Date().toISOString() };
  memberships.insert(item);
  db.saveDatabase();
  res.status(201).json(item);
});

app.get('/api/memberships', verifyToken, (req, res) => {
  res.json(memberships.chain().simplesort('submittedAt', true).data());
});

app.delete('/api/memberships/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const doc = memberships.findOne({ id });
  if (!doc) return res.status(404).json({ error: 'Not found' });
  memberships.remove(doc);
  db.saveDatabase();
  res.status(204).end();
});

// Gallery listing
app.get('/api/gallery', (req, res) => {
  try {
    const galleryDir = path.resolve(__dirname, '..', 'assets', 'gallery');
    if (!fs.existsSync(galleryDir)) return res.json([]);
    const files = fs.readdirSync(galleryDir)
      .filter((f) => /\.(png|jpe?g|webp|gif|svg|heic)$/i.test(f))
      .map((name) => ({
        src: `/assets/gallery/${name}`,
        alt: name.replace(/[_-]+/g, ' ').replace(/\.[^.]+$/, ''),
        type: name.split('.').pop().toLowerCase()
      }));
    res.json(files);
  } catch (e) {
    res.status(500).json({ error: 'Failed to list gallery' });
  }
});

// Serve HEIC files with proper headers
app.get('/assets/gallery/*.heic', (req, res) => {
  const filePath = path.resolve(__dirname, '..', req.path);
  if (fs.existsSync(filePath)) {
    res.setHeader('Content-Type', 'image/heic');
    res.setHeader('Cache-Control', 'public, max-age=31536000');
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.status(404).send('File not found');
  }
});

// Serve frontend
const publicDir = path.resolve(__dirname, '..');
app.use(express.static(publicDir));
// Fallback to index for non-API GETs
app.get(/^(?!\/api\/).*/, (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`BOD Login: Username: ${BOD_USERNAME}, Password: ${BOD_PASSWORD}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please stop the existing server or use a different port.`);
  } else {
    console.error('Server error:', err);
  }
  process.exit(1);
});


