const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {
  let token;

  // From Authorization header
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // From cookies
  if (!token && req.cookies?.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    console.log('No token found');
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.log('Invalid token');
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

const restrictTo = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({
      error: 'Forbidden: Insufficient permissions',
    });
  }
  next();
};

module.exports = { requireAuth, restrictTo };
