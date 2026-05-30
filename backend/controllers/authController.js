const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userModel = require('../models/userModel');

const signToken = (user) => {
  const payload = {
    id: user.id,
    rol: user.rol,
    kullanici_adi: user.kullanici_adi,
    email: user.email,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

const setAuthCookie = (res, token) => {
  res.cookie(process.env.AUTH_COOKIE_NAME || 'token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

exports.register = async (req, res, next) => {
  try {
    const { kullanici_adi, email, sifre } = req.body;

    const existingByEmail = await userModel.findByEmail(email);
    if (existingByEmail) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const existingByUsername = await userModel.findByUsername(kullanici_adi);
    if (existingByUsername) {
      return res.status(400).json({ message: 'Username already in use' });
    }

    const hashed = await bcrypt.hash(sifre, 10);

    const userId = await userModel.create({
      kullanici_adi,
      email,
      sifre: hashed,
      rol: 'kullanici',
    });

    const user = await userModel.findById(userId);
    const token = signToken(user);
    setAuthCookie(res, token);

    return res.status(201).json({
      user: {
        id: user.id,
        kullanici_adi: user.kullanici_adi,
        email: user.email,
        rol: user.rol,
      },
    });
  } catch (err) {
    return next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, sifre } = req.body;

    const user = await userModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const ok = await bcrypt.compare(sifre, user.sifre);
    if (!ok) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = signToken(user);
    setAuthCookie(res, token);

    return res.status(200).json({
      user: {
        id: user.id,
        kullanici_adi: user.kullanici_adi,
        email: user.email,
        rol: user.rol,
      },
    });
  } catch (err) {
    return next(err);
  }
};

exports.logout = async (req, res, next) => {
  try {
    res.clearCookie(process.env.AUTH_COOKIE_NAME || 'token');
    res.clearCookie(process.env.SESSION_COOKIE_NAME || 'sid');

    if (req.session) {
      await new Promise((resolve) => req.session.destroy(() => resolve()));
    }
    return res.status(200).json({ message: 'Logged out' });
  } catch (err) {
    return next(err);
  }
};

exports.me = async (req, res, next) => {
  try {
    return res.status(200).json({ user: req.user });
  } catch (err) {
    return next(err);
  }
};
