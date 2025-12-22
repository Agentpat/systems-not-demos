const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema(
  {
    filename: String,
    originalName: String,
  },
  { _id: false }
);

const caseStudySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true },
    vision: { type: String, required: true },
    problem: { type: String, required: true },
    plannedFeatures: [{ type: String }],
    architectureNotes: [{ type: String }],
    challenges: [{ type: String }],
    media: [mediaSchema],
    status: { type: String, default: 'in-progress' },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CaseStudy', caseStudySchema);
