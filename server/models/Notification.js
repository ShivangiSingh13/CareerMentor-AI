const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['job', 'application', 'roadmap', 'resume', 'system'], required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    linkTo: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
