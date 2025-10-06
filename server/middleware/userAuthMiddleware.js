// In server/middleware/userAuthMiddleware.js

const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // Get token from the 'x-auth-token' header
  const token = req.header('x-auth-token');

  // Check if there's no token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify the token is valid
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach the user's payload to the request object
    req.user = decoded.user;
    
    next(); // Pass control to the next function
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};