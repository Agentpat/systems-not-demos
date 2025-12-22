const mongoose = require('mongoose');

const linkSchema = new mongoose.Schema(
  {
    live: String,
    github: String,
    video: String,
  },
  { _id: false }
);

const mediaSchema = new mongoose.Schema(
  {
    filename: String, // GridFS filename
    originalName: String,
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true },
    problem: { type: String, required: true },
    solution: { type: String, required: true },
    stack: [{ type: String }],
    features: [{ type: String }],
    uxDecisions: [{ type: String }],
    links: linkSchema,
    media: [mediaSchema],
    sortOrder: { type: Number, default: 0 },
    visibility: { type: String, enum: ['public', 'private'], default: 'public' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);
