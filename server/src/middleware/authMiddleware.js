const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { userId, role }
    next();

  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

const authorityOnly = (req, res, next) => {
  if (req.user.role !== 'authority' && req.user.role !== 'moderator') {
    return res.status(403).json({ message: 'Authority access only' });
  }
  next();
};

module.exports = { protect, authorityOnly };