const router = require('express').Router();

const { User } = require('../../db/models');
const { 
  setTokenCookie, 
  restoreUser, 
  requireAuth 
} = require('../../utils/auth.js');

/******** TEST ROUTES ********/
router.post('/test', (req, res) => {
  return res.json({ requestBody: req.body });
});

router.get('/set-token-cookie', async (_req, res) => {
  const user = await User.findOne({
    where: {
      username: 'Demo-lition'
    }
  });
  setTokenCookie(res, user);
  return res.json({ user });
});

router.get(
  '/restore-user',
  restoreUser,
  (req, res) => {
    return res.json(req.user);
  }
);

router.get(
  '/require-auth',
  requireAuth,
  (req, res) => {
    return res.json(req.user);
  }
)

module.exports = router;