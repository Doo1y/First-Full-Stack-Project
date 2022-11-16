const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const routes = require('./routes/index');

// Check if environment is set to production
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

module.exports = app;