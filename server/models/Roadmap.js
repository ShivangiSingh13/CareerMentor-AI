const mongoose = require('mongoose');

const roadmapSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    targetRole: {
      type: String,
      required: true
    },
    currentSkills: {
      type: [String],
      default: []
    },
    weeks: [
      {
        title: {
          type: String,
          required: true
        },
        topics: {
          type: [String],
          default: []
        },
        resources: {
          type: [String],
          default: []
        }
        ,
        completed: {
          type: Boolean,
          default: false
        }
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Roadmap', roadmapSchema);
