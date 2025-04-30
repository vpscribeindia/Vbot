
const jwt = require('jsonwebtoken');
const cookie = require('cookie');
const JWT_SECRET = process.env.JWT_SECRET;

const authenticate = (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token is not valid' });
  }
};


const socketAuth = (socket, next) => {
  try {
    const cookies = socket.handshake.headers.cookie;
    if (!cookies) throw new Error('No cookies found');

    const { accessToken } = cookie.parse(cookies);
    const decoded = jwt.verify(accessToken, JWT_SECRET);

    socket.user = decoded; 
    next();
  } catch (err) {
    next(new Error('Socket auth error: ' + err.message));
  }
};
module.exports = {authenticate, socketAuth};



