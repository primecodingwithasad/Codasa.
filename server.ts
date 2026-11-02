import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { INITIAL_PINS, CURRENT_USER, CREATORS, INITIAL_BOARDS, INITIAL_COMMENTS } from './src/data/seedData.ts';
import { Pin, User, Board, PinComment } from './src/types/index.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// High limit for image uploads (base64 DataURLs)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Data storage directory
const DATA_DIR = path.resolve(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const PINS_FILE = path.join(DATA_DIR, 'pins.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const BOARDS_FILE = path.join(DATA_DIR, 'boards.json');
const COMMENTS_FILE = path.join(DATA_DIR, 'comments.json');

// Helper to read and write data with fallback to seed data
function readJsonFile<T>(filePath: string, fallback: T): T {
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(content) as T;
    }
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
  }
  fs.writeFileSync(filePath, JSON.stringify(fallback, null, 2), 'utf-8');
  return fallback;
}

function writeJsonFile<T>(filePath: string, data: T): void {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
  }
}

// In-memory state initialized from persistent files
let pins: Pin[] = readJsonFile<Pin[]>(PINS_FILE, INITIAL_PINS);
let users: User[] = readJsonFile<User[]>(USERS_FILE, [CURRENT_USER, ...CREATORS]);
let boards: Board[] = readJsonFile<Board[]>(BOARDS_FILE, INITIAL_BOARDS);
let comments: PinComment[] = readJsonFile<PinComment[]>(COMMENTS_FILE, INITIAL_COMMENTS);

// Ensure all INITIAL_PINS exist in pins
const existingPinIds = new Set(pins.map((p) => p.id));
let addedMissing = false;
for (const seedPin of INITIAL_PINS) {
  if (!existingPinIds.has(seedPin.id)) {
    pins.push(seedPin);
    existingPinIds.add(seedPin.id);
    addedMissing = true;
  }
}
if (addedMissing) {
  writeJsonFile(PINS_FILE, pins);
}

// List of connected SSE clients for real-time live synchronization across all viewers
type SSEClient = { id: number; res: express.Response };
let sseClients: SSEClient[] = [];
let nextClientId = 1;

function broadcastLiveEvent(eventType: string, data: any) {
  const payload = `event: ${eventType}\ndata: ${JSON.stringify(data)}\n\n`;
  sseClients.forEach((client) => {
    try {
      client.res.write(payload);
    } catch {
      // client disconnected
    }
  });
}

// --- API ROUTES ---

// 1. Server-Sent Events (SSE) endpoint for instantaneous multi-viewer live updates
app.get('/api/live/stream', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });
  res.write(': connected\n\n');

  const clientId = nextClientId++;
  sseClients.push({ id: clientId, res });

  req.on('close', () => {
    sseClients = sseClients.filter((c) => c.id !== clientId);
  });
});

// 2. GET /api/pins (with search, userId, category, and tag filtering)
app.get('/api/pins', (req, res) => {
  const { q, userId, category, tag } = req.query;
  let results = [...pins];

  // Specific user ID filter
  if (typeof userId === 'string' && userId.trim()) {
    const targetUserId = userId.trim().toLowerCase();
    results = results.filter(
      (p) =>
        p.userId.toLowerCase() === targetUserId ||
        p.creator.id.toLowerCase() === targetUserId ||
        p.creator.username.toLowerCase() === targetUserId.replace(/^@/, '')
    );
  }

  // Category filter
  if (typeof category === 'string' && category.trim() && category !== 'All') {
    results = results.filter((p) => p.category.toLowerCase() === category.toLowerCase());
  }

  // Tag filter
  if (typeof tag === 'string' && tag.trim()) {
    const targetTag = tag.trim().toLowerCase().replace(/^#/, '');
    results = results.filter((p) => p.tags.some((t) => t.toLowerCase() === targetTag));
  }

  // Query search (across User ID, creator name, username, title, description, tags, category)
  if (typeof q === 'string' && q.trim()) {
    const query = q.trim().toLowerCase();
    const isUserQuery = query.startsWith('usr_') || query.startsWith('@');
    const cleanUserQuery = query.replace(/^@/, '');

    results = results.filter((p) => {
      // Check user ID match
      if (
        p.userId.toLowerCase().includes(query) ||
        p.creator.id.toLowerCase().includes(query) ||
        p.creator.username.toLowerCase().includes(cleanUserQuery) ||
        p.creator.name.toLowerCase().includes(query)
      ) {
        return true;
      }
      // Content match
      return (
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.tags.some((t) => t.toLowerCase().includes(query.replace(/^#/, '')))
      );
    });
  }

  res.json({
    pins: results,
    total: results.length,
  });
});

// 3. POST /api/pins (Upload new post - visible to ALL other viewers!)
app.post('/api/pins', (req, res) => {
  try {
    const { title, description, imageUrl, destinationUrl, category, tags, userId, creator, aspectRatio } = req.body;

    if (!title || !imageUrl) {
      return res.status(400).json({ error: 'Title and image are required.' });
    }

    const creatorUser = users.find((u) => u.id === userId) || creator || {
      id: userId || 'usr_guest',
      name: 'Anonymous Creator',
      username: 'guest',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Guest',
    };

    const newPin: Pin = {
      id: 'pin_' + Date.now(),
      title: String(title).trim(),
      description: description ? String(description).trim() : '',
      imageUrl: String(imageUrl),
      aspectRatio: typeof aspectRatio === 'number' && aspectRatio > 0 ? aspectRatio : 0.75,
      dominantColor: '#1e293b',
      destinationUrl: destinationUrl ? String(destinationUrl).trim() : undefined,
      category: category ? String(category).trim() : 'General',
      tags: Array.isArray(tags) && tags.length > 0 ? tags : ['inspiration'],
      userId: creatorUser.id,
      creator: {
        id: creatorUser.id,
        name: creatorUser.name,
        username: creatorUser.username,
        avatar: creatorUser.avatar,
      },
      likesCount: 0,
      savesCount: 0,
      createdAt: new Date().toISOString(),
    };

    // Prepend to pins so new upload appears at top of feed for all viewers
    pins = [newPin, ...pins];
    writeJsonFile(PINS_FILE, pins);

    // Broadcast instant real-time event to all connected viewers!
    broadcastLiveEvent('pin_created', newPin);

    console.log(`[Codasa Live] New pin created by ${creatorUser.name} (${creatorUser.id}): "${newPin.title}"`);
    return res.status(201).json({ pin: newPin });
  } catch (err: any) {
    console.error('Error creating pin:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// 4. DELETE /api/pins/:id
app.delete('/api/pins/:id', (req, res) => {
  const { id } = req.params;
  const initialLen = pins.length;
  pins = pins.filter((p) => p.id !== id);
  if (pins.length !== initialLen) {
    writeJsonFile(PINS_FILE, pins);
    broadcastLiveEvent('pin_deleted', { id });
  }
  res.json({ success: true });
});

// 5. POST /api/pins/:id/like
app.post('/api/pins/:id/like', (req, res) => {
  const { id } = req.params;
  const { isLiked } = req.body;
  const pin = pins.find((p) => p.id === id);
  if (pin) {
    pin.likesCount = Math.max(0, pin.likesCount + (isLiked ? 1 : -1));
    writeJsonFile(PINS_FILE, pins);
    broadcastLiveEvent('pin_updated', pin);
    return res.json({ pin });
  }
  return res.status(404).json({ error: 'Pin not found' });
});

// 6. POST /api/pins/:id/save
app.post('/api/pins/:id/save', (req, res) => {
  const { id } = req.params;
  const pin = pins.find((p) => p.id === id);
  if (pin) {
    pin.savesCount += 1;
    writeJsonFile(PINS_FILE, pins);
    broadcastLiveEvent('pin_updated', pin);
    return res.json({ pin });
  }
  return res.status(404).json({ error: 'Pin not found' });
});

// 7. GET & POST /api/pins/:id/comments
app.get('/api/pins/:id/comments', (req, res) => {
  const { id } = req.params;
  const pinComments = comments.filter((c) => c.pinId === id);
  res.json({ comments: pinComments });
});

app.post('/api/pins/:id/comments', (req, res) => {
  const { id } = req.params;
  const { text, user } = req.body;
  if (!text || !text.trim()) {
    return res.status(400).json({ error: 'Comment text is required' });
  }

  const newComment: PinComment = {
    id: 'cmt_' + Date.now(),
    pinId: id,
    userId: user?.id || 'usr_guest',
    user: {
      name: user?.name || 'Viewer',
      username: user?.username || 'viewer',
      avatar: user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Guest',
    },
    text: text.trim(),
    createdAt: 'Just now',
    likesCount: 0,
    replies: [],
  };

  comments = [newComment, ...comments];
  writeJsonFile(COMMENTS_FILE, comments);
  broadcastLiveEvent('comment_added', newComment);

  res.status(201).json({ comment: newComment });
});

// 8. GET /api/search/suggestions (Instant structured search suggestions for user ID or content)
app.get('/api/search/suggestions', (req, res) => {
  const q = String(req.query.q || '').trim().toLowerCase();
  if (!q) {
    return res.json({
      userSuggestions: [],
      contentSuggestions: [],
      tagSuggestions: [],
      categorySuggestions: [],
    });
  }

  const cleanUserQuery = q.replace(/^@/, '');

  // 1. User suggestions (search by user ID like usr_..., handle @..., or name)
  const userSuggestions = users
    .filter(
      (u) =>
        u.id.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(cleanUserQuery) ||
        u.name.toLowerCase().includes(q)
    )
    .slice(0, 5)
    .map((u) => {
      const userPinsCount = pins.filter((p) => p.userId === u.id).length;
      return {
        id: u.id,
        name: u.name,
        username: u.username,
        avatar: u.avatar,
        pinsCount: userPinsCount,
        matchType: u.id.toLowerCase().includes(q)
          ? 'User ID'
          : u.username.toLowerCase().includes(cleanUserQuery)
          ? 'Handle'
          : 'Creator Name',
      };
    });

  // 2. Content / Pin Title suggestions
  const contentSuggestions = pins
    .filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    )
    .slice(0, 5)
    .map((p) => ({
      id: p.id,
      title: p.title,
      category: p.category,
      imageUrl: p.imageUrl,
      creatorName: p.creator.name,
      creatorId: p.creator.id,
    }));

  // 3. Tag suggestions
  const allTags = new Set<string>();
  pins.forEach((p) => p.tags.forEach((t) => allTags.add(t.toLowerCase())));
  const cleanTagQuery = q.replace(/^#/, '');
  const tagSuggestions = Array.from(allTags)
    .filter((t) => t.includes(cleanTagQuery))
    .slice(0, 5)
    .map((tag) => {
      const count = pins.filter((p) => p.tags.some((t) => t.toLowerCase() === tag)).length;
      return { tag, count };
    });

  // 4. Category suggestions
  const allCategories = ['Architecture', 'Photography', 'Interior Design', 'Craft & Ceramics', 'Tech & Dev', 'Fashion & Editorial', 'Travel & Nature', 'Typography', 'Culinary Arts'];
  const categorySuggestions = allCategories
    .filter((c) => c.toLowerCase().includes(q))
    .slice(0, 3);

  return res.json({
    userSuggestions,
    contentSuggestions,
    tagSuggestions,
    categorySuggestions,
  });
});

// 9. GET /api/users
app.get('/api/users', (req, res) => {
  res.json({ users });
});

// 10. POST /api/users/profile
app.post('/api/users/profile', (req, res) => {
  const { id, name, username, bio, website, location, pronouns, avatar, coverImage } = req.body;
  const userIndex = users.findIndex((u) => u.id === id);
  if (userIndex !== -1) {
    users[userIndex] = {
      ...users[userIndex],
      name: name || users[userIndex].name,
      username: username || users[userIndex].username,
      bio: bio !== undefined ? bio : users[userIndex].bio,
      website: website !== undefined ? website : users[userIndex].website,
      location: location !== undefined ? location : users[userIndex].location,
      pronouns: pronouns !== undefined ? pronouns : users[userIndex].pronouns,
      avatar: avatar || users[userIndex].avatar,
      coverImage: coverImage || users[userIndex].coverImage,
    };
    writeJsonFile(USERS_FILE, users);

    // Update pins creator info for this user
    pins = pins.map((p) => {
      if (p.userId === id) {
        return {
          ...p,
          creator: {
            ...p.creator,
            name: users[userIndex].name,
            username: users[userIndex].username,
            avatar: users[userIndex].avatar,
          },
        };
      }
      return p;
    });
    writeJsonFile(PINS_FILE, pins);
    broadcastLiveEvent('user_updated', users[userIndex]);

    return res.json({ user: users[userIndex] });
  }
  return res.status(404).json({ error: 'User not found' });
});

// 11. GET /api/boards & POST /api/boards
app.get('/api/boards', (req, res) => {
  res.json({ boards });
});

app.post('/api/boards', (req, res) => {
  const { title, description, isPrivate, userId, coverImage } = req.body;
  const newBoard: Board = {
    id: 'board_' + Date.now(),
    userId: userId || 'usr_me',
    title: title || 'Untitled Board',
    description: description || '',
    coverImage: coverImage || pins[0]?.imageUrl || '',
    isPrivate: !!isPrivate,
    pinIds: [],
    sections: [],
    collaborators: [],
    createdAt: new Date().toISOString(),
  };
  boards = [newBoard, ...boards];
  writeJsonFile(BOARDS_FILE, boards);
  res.status(201).json({ board: newBoard });
});

// --- VITE MIDDLEWARE OR STATIC SERVING ---
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Codasa Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
