const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.cookies && req.cookies[process.env.AUTH_COOKIE_NAME || 'token'];
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: decoded.id,
      rol: decoded.rol,
      kullanici_adi: decoded.kullanici_adi,
      email: decoded.email,
    };

    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};
