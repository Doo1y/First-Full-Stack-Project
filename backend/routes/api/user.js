const express = require('express');

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();

// Signup route handler
router.post('/', async (req, res) => {
  const { username, email, password } = req.body;
  const user = await User.signup({ username, email, password });
  
  setTokenCookie(res, user);

  return res.json(user);
});


module.exports = router;

