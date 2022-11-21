const express = require('express');

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();

// Login route handler
router.post('/', async (req, res, next) => {
  const { credential, password } = req.body;
  const user = await User.login( { credential, password } )

  if (!user) return next(
    Error(JSON.stringify({
      status: 404,
      title: 'Login failed',
      errors: ['The provided credentials were invalid.'],
    }))
  );

  await setTokenCookie(res, user);

  return res.json(user);
});

// Logout route handler
router.delete('/', (_req, res) => {
  res.clearCookie('token');
  return res.json({ message: 'logout successful!' })
});

// Restore session user
router.get(
  '/',
  restoreUser,
  (req, res) => {
    const { user } = req;
    if (user) {
      return res.json({
        user: user.toSafeObject()
      });
    } else return res.json({});
  }
);


module.exports = router;
