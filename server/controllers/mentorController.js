const ChatHistory = require('../models/ChatHistory');
const { getChatReply, generateSessionTitle } = require("../services/aiService");

const getHistory = async (req, res) => {
  try {
    const chatHistory = await ChatHistory.findOne({ userId: req.user.userId });

    return res.json({
      success: true,
      messages: chatHistory?.messages || []
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch chat history' });
  }
};

const chat = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    const chatHistory = await ChatHistory.findOne({ userId: req.user.userId });
    const historyMessages = chatHistory?.messages || [];
    const recentHistory = historyMessages.slice(-10);
    const aiResponse = await mentorReply({ userMessage: message, history: recentHistory });

    const updatedMessages = [
      ...historyMessages,
      { role: 'user', content: message, timestamp: new Date() },
      { role: 'assistant', content: assistantMessage, timestamp: new Date() }
    ];

    const savedHistory = await ChatHistory.findOneAndUpdate(
      { userId: req.user.userId },
      { userId: req.user.userId, messages: updatedMessages },
      { upsert: true, new: true }
    );

    return res.json({
      success: true,
      reply: assistantMessage,
      messages: savedHistory.messages
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to send chat message' });
  }
};

module.exports = {
  getHistory,
  chat
};
