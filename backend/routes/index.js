const router = require('express').Router();

const apiRouter = require('./api');

// router.get('/hello/world', (req, res) => {
//   res.cookie('XSRF-TOKEN', req.csrfToken());
//   res.json('Hello World!')
// });

router.get('/api/csrf/restore', (req, res, next) => {
  const csrfToken = req.csrfToken();
  res.cookie('XSRF-TOKEN', csrfToken);
  res.status(200).json({
    'XSRF-Token': csrfToken
  });
});

router.use('/api', apiRouter);

module.exports = router;

