const express = require('express');
const cors = require('cors');
const session = require('express-session');
const MySQLStoreFactory = require('express-mysql-session');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const path = require('path');

const { sessionPool } = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const kitapRoutes = require('./routes/kitapRoutes');
const yorumRoutes = require('./routes/yorumRoutes');
const okumalistesiRoutes = require('./routes/okumalistesiRoutes');
const soruRoutes = require('./routes/soruRoutes');
const haberRoutes = require('./routes/haberRoutes');
const galeriRoutes = require('./routes/galeriRoutes');
const yazarRoutes = require('./routes/yazarRoutes');
const kategoriRoutes = require('./routes/kategoriRoutes');
const sitemapRoutes = require('./routes/sitemapRoutes');
const adminRoutes = require('./routes/adminRoutes');
const ziyaretciRoutes = require('./routes/ziyaretciRoutes');
const visitCounterMiddleware = require('./middleware/visitCounterMiddleware');

const app = express();

app.set('trust proxy', 1);

const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';

app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
  })
);

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(visitCounterMiddleware);

const MySQLStore = MySQLStoreFactory(session);
const sessionStore = new MySQLStore(
  {
    clearExpired: true,
    checkExpirationInterval: 15 * 60 * 1000,
    expiration: 24 * 60 * 60 * 1000,
  },
  sessionPool
);

app.use(
  session({
    key: process.env.SESSION_COOKIE_NAME || 'sid',
    secret: process.env.SESSION_SECRET || process.env.JWT_SECRET || 'dev_secret',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);
//online kullanıcı sayısı için session kontrolü
app.use((req, res, next) => {
  if (!req.session) return next();

  const now = Date.now();
  if (!req.session.lastSeen || now - req.session.lastSeen > 10 * 1000) {
    req.session.lastSeen = now;
  }

  return next();
});

const csrfProtection = csrf({
  cookie: {
    key: process.env.CSRF_COOKIE_NAME || 'csrf',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  },
});

app.use((req, res, next) => {
  const method = req.method.toUpperCase();
  if (method === 'GET' || method === 'HEAD' || method === 'OPTIONS') return next();
  return csrfProtection(req, res, next);
});

app.get('/api/csrf-token', csrfProtection, (req, res) => {
  res.status(200).json({ csrfToken: req.csrfToken() });
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/health', (req, res) => {
  res.status(200).json({ ok: true });
});

app.use('/api/auth', authRoutes);
app.use('/api/kitaplar', kitapRoutes);
app.use('/api/yorumlar', yorumRoutes);
app.use('/api/okuma-listesi', okumalistesiRoutes);
app.use('/api/sorular', soruRoutes);
app.use('/api/haberler', haberRoutes);
app.use('/api/galeri', galeriRoutes);
app.use('/api/yazarlar', yazarRoutes);
app.use('/api/kategoriler', kategoriRoutes);
app.use('/api/admin', adminRoutes);
app.use('/', sitemapRoutes);
app.use('/api/ziyaretci', ziyaretciRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use((err, req, res, next) => {
  if (err && err.code === 'EBADCSRFTOKEN') {
    return res.status(403).json({ message: 'Invalid CSRF token' });
  }

  const status = err && err.status ? err.status : 500;
  const message = err && err.message ? err.message : 'Server error';
  return res.status(status).json({ message });
});

module.exports = app;
