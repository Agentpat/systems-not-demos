require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const { connectDB } = require('./config/db');

const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const projectRoutes = require('./routes/projects');
const caseStudyRoutes = require('./routes/caseStudies');
const uploadRoutes = require('./routes/uploads');
const templateRoutes = require('./routes/template');

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || '*',
    credentials: true,
  })
);
app.use(helmet());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
  })
);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/case-studies', caseStudyRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/template', templateRoutes);

app.use((err, _req, res, _next) => {
  // Minimal error handler to avoid noisy logs
  console.error(err);
  res.status(500).json({ message: 'Server error' });
});

async function start() {
  try {
    await connectDB(process.env.MONGO_URI);
    app.locals.bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'uploads' });
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`API listening on ${port}`);
    });
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
}

start();
