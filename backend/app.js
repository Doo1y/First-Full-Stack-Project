const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const routes = require('./routes/index');

// Check if environment is set to production
const { ValidationError } = require('sequelize');
const { environment } = require('./config');
const isProduction = environment === 'production';

// Express application
const app = express();

// Middleware for logging information about requests/responses
app.use(morgan('dev'));

// Middleware for parsing cookies
app.use(cookieParser());

// Express using json
app.use(express.json());

// Security Middlewares
// Allow CORS (Cross-Orgin Resource Sharing) ONLY in development
if (!isProduction) {
  app.use(cors());
}

// Set security headers using helmet
app.use(
  helmet.crossOriginResourcePolicy({
    policy: 'cross-origin'
  })
);

// Configure csurf middleware to use cookies
/** 
 * csurf middleware adds a @name _csrf cookie that is HTTP-only
 * csurf also adds a @method req.csrfToken will be set to @name XSRF-TOKEN cookie 
 * These two cookies work together to provide CSRF protection for the application
 * 
 * @name XSRF-TOKEN cookie value needs to be sent in the header of any request
 * with all HTTP methods besides GET
 * */
app.use(
  csurf({
    cookie: {
      secure: isProduction,
      sameSite: isProduction && 'Lax',
      httpOnly: true
    }
  })
);

app.use(routes);

app.use((_req, _res, next) => {
  const err = new Error("The requested resource couldn't be found.");
  err.title = "Resource Not Found";
  err.errors = ["The requested resource couldn't be found."];
  err.status = 404;
  next(err);
});


// Process sequelize errors
app.use((err, _req, _res, next) => {
  // check if error is a Sequelize error:
  if (err instanceof ValidationError) {
    err.errors = err.errors.map((e) => e.message);
    err.title = 'Validation error';
  }
  next(err);
});

app.use((err, _req, res, _next) => {
  res.status(err.status || 500);
  console.error(err);
  res.json({
    title: err.title || 'Server Error',
    message: err.message,
    errors: err.errors,
    stack: isProduction ? null : err.stack
  });
});


module.exports = app;