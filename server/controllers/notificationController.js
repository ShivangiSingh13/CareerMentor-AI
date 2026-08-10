const Notification = require('../models/Notification');

const listNotifications = async (req, res) => {
  try {
    const { unreadOnly } = req.query;
    const filter = { userId: req.user.userId };
    if (unreadOnly === 'true') filter.isRead = false;

    const items = await Notification.find(filter).sort({ createdAt: -1 }).limit(50);
    return res.json({ success: true, message: 'Notifications retrieved', data: items });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to list notifications' });
  }
};

const markAsRead = async (req, res) => {
  try {
    const id = req.params.id;
    const n = await Notification.findOneAndUpdate({ _id: id, userId: req.user.userId }, { isRead: true }, { new: true });
    if (!n) return res.status(404).json({ success: false, message: 'Notification not found' });
    return res.json({ success: true, message: 'Marked as read', data: n });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to mark as read' });
  }
};

const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.user.userId, isRead: false }, { isRead: true });
    return res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to mark all as read' });
  }
};

const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({ userId: req.user.userId, isRead: false });
    return res.json({ success: true, message: 'Unread count', data: { count } });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to get unread count' });
  }
};

module.exports = { listNotifications, markAsRead, markAllAsRead, getUnreadCount };
