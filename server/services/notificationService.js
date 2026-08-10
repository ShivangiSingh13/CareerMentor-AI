const Notification = require('../models/Notification');

const createNotification = async ({ userId, type, title, message, linkTo }) => {
  return Notification.create({ userId, type, title, message, linkTo });
};

module.exports = { createNotification };
