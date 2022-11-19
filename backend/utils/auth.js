const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../config');
const { User } = require('../db/models');

const { secret, expiresIn } = jwtConfig;

/** 
 * @function setTokenCookie() takes the response and user as its arguments
 * and returns a JWT token using the imported { secret }.
 * JWT payload is the user object instance returned from .toSafeObject() method.
 * 
 * Used in the login and signup routes
 */
const setTokenCookie = (res, user) => {
  // Create token
  const token = jwt.sign(
    { data: user.toSafeObject() }, // { data: { id, username, and email } }
    secret,
    { expiresIn: parseInt(expiresIn) }
  );

  const isProduction = process.env.NODE_ENV === "production";

  // Set the token cookie
  res.cookie('token', token ,{
    maxAge: expiresIn * 1000,
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction && "Lax"
  });

  return token;
};

const restoreUser = (req, res, next) => {
  // token parsed from cookies
  const { token } = req.cookies;

  return jwt.verify(token, secret, null, async (err, jwtPayload) => {
    if (err) {
      return next();
    }
    
    try {
      const { id } = jwtPayload.data;
      req.user = await User.scope('currentUser').findByPk(id);
    } catch (e) {
      res.clearCookie('token');
      return next();
    }

    if (!req.user) res.clearCookie('token');

    return next();
  });
};

// If !currentUser, throw Error
const requireAuth = [
  restoreUser,
  function(req, _res, next) {
    if (req.user) return next();

    const err = new Error('Unauthorized');
    err.title = 'Unauthorized';
    err.errors = ['Unauthorized'];
    err.status = 401;
    return next(err);
  }
];

module.exports = {
  setTokenCookie,
  restoreUser,
  requireAuth
}