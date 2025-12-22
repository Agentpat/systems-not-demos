const mongoose = require('mongoose');

const skillsSchema = new mongoose.Schema(
  {
    label: String,
    items: [String],
  },
  { _id: false }
);

const contactSchema = new mongoose.Schema(
  {
    email: String,
    github: String,
    linkedin: String,
    twitter: String,
    website: String,
    calendly: String,
  },
  { _id: false }
);

const profileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true },
    roleTitle: { type: String, required: true },
    heroTagline: { type: String, required: true },
    valueLine: { type: String, required: true },
    about: { type: String, required: true },
    heroImage: { type: String }, // GridFS filename
    skills: [skillsSchema],
    contacts: contactSchema,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Profile', profileSchema);
