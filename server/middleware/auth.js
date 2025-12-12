import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1] || 
                  req.cookies?.token || 
                  req.headers['x-access-token'];

    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ error: 'Server configuration error' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-passwordHash');

    if (!user || user.status !== 'active') {
      return res.status(401).json({ error: 'Invalid or inactive user' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Optional authentication - validates token if provided, but doesn't require it
export const optionalAuthenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1] || 
                  req.cookies?.token || 
                  req.headers['x-access-token'];

    if (!token) {
      // No token provided, continue without authentication
      req.user = null;
      return next();
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ error: 'Server configuration error' });
    }
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select('-passwordHash');

      if (user && user.status === 'active') {
        req.user = user;
      } else {
        req.user = null;
      }
    } catch (error) {
      // Invalid token, but continue without authentication
      req.user = null;
    }
    
    next();
  } catch (error) {
    // On any error, continue without authentication
    req.user = null;
    next();
  }
};

export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
};

