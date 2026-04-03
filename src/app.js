const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.get('/', (req, res) => res.json({ message: 'Finance API running fine!!' }));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/records', require('./routes/recordRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found.' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

app.use('/api/users', require('./routes/userRoutes'));

module.exports = app;