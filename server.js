const express = require('express');
const app = express();
const dotenv = require('dotenv');

const connectDB = require('./config/db');

dotenv.config({
  path: './config/config.env'
});

// Set static folder // if we want to serve static files, this is necessary!

app.use(express.static('public'));

// Body parser
app.use(express.json());

// Get routes
const users = require('./routes/users');
const auth = require('./routes/auth');
const threads = require('./routes/threads');
const answers = require('./routes/answers');

// Mount routes
app.use('/api/v1/users', users);
app.use('/api/v1/auth', auth);
app.use('/api/v1/threads', threads);
app.use('/api/v1/answers', answers);

connectDB();

const server = app.listen(
  process.env.PORT,
  console.log(
    `Server listening in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`
  )
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (error, promise) => {
  console.log(`Error: ${error.message}`);
  // Close server and exit process
  server.close(() => {
    process.exit(1);
  });
});
