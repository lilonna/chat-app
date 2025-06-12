const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const User = require('../models/User');

router.get('/', async (req, res) => {
  const messages = await Message.find().sort({ timestamp: 1 });
  res.json(messages);
});
router.get('/:user1/:user2', async (req, res) => {
  const { user1, user2 } = req.params;
  const messages = await Message.find({
    $or: [
      { sender: user1, recipient: user2 },
      { sender: user2, recipient: user1 }
    ]
  }).sort({ timestamp: 1 });

  res.json(messages);
});
router.get('/conversations/:username', async (req, res) => {
  const username = req.params.username;
  try {
    const sent = await Message.distinct('recipient', { sender: username });
    const received = await Message.distinct('sender', { recipient: username });
    const allUsernames = [...new Set([...sent, ...received])];
    const users = await User.find({
      username: { $in: allUsernames }
    }).select('_id username avatar');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load conversations' });
  }
});


module.exports = router;
