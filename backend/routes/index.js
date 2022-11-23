const router = require('express').Router();

const apiRouter = require('./api');

router.use('/api', apiRouter);

// Test route
router.get('/hello/world', (req, res) => {
  res.cookie('XSRF-TOKEN', req.csrfToken());
  res.json('Hello World!')
});

// Add a XSRF-TOKEN cookie
router.get('/api/csrf/restore', (req, res, next) => {
  const csrfToken = req.csrfToken();
  res.cookie('XSRF-TOKEN', csrfToken);
  res.status(200).json({
    'XSRF-Token': csrfToken
  });
});

module.exports = router;

