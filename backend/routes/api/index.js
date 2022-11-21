const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./user.js')

const { User } = require('../../db/models');
const { 
  setTokenCookie, 
  restoreUser, 
  requireAuth 
} = require('../../utils/auth.js');

router.use('/session', sessionRouter);

router.use('/users', usersRouter);

/******** TEST ROUTES ********/
router.post('/test', (req, res) => {
  return res.json({ requestBody: req.body });
});

// // https://localhost:8000/api/set-token-cookie
router.get('/set-token-cookie', async (_req, res) => {
  const user = await User.findOne({
    where: {
      username: 'Demo-lition'
    }
  });
  setTokenCookie(res, user);
  return res.json({ user });
});

// https://localhost:8000/api/restore-user
router.get(
  '/restore-user',
  restoreUser,
  (req, res) => {
    return res.json(req.user);
  }
);

// https://localhost:8000/api/require-auth
router.get(
  '/require-auth',
  requireAuth,
  (req, res) => {
    return res.json(req.user);
  }
)

module.exports = router;