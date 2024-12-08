// File: middleware/authMiddleware.js
module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || authHeader !== `Bearer ${process.env.AUTH_TOKEN}`) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    next();
  };
  