const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const User = require('../models/User');

router.get('/', async (req, res) => {
  console.log('✅ Route HIT for');
  const messages = await Message.find().sort({ timestamp: 1 });
  res.json(messages);
});
router.get('/conversations/:username', async (req, res) => {
  const username = req.params.username.trim().toLowerCase(); // normalize case
  try {
    // Case-insensitive queries using regex
    const sentTo = await Message.distinct('recipient', { 
      sender: { $regex: new RegExp(`^${username}$`, 'i') } 
    });
    
    const receivedFrom = await Message.distinct('sender', { 
      recipient: { $regex: new RegExp(`^${username}$`, 'i') } 
    });
    if (sentTo.length === 0 && receivedFrom.length === 0) {
      console.log('No conversations found for user');
      return res.json([]);
    }

    const otherUsernames = [...new Set([...sentTo, ...receivedFrom])];
    const users = await User.find({
      username: { 
        $in: otherUsernames.map(name => new RegExp(`^${name}$`, 'i'))
      }
    }).select('_id username avatar');

  
    res.json(users);
  } catch (err) {
    console.error('❌ Route error:', err);
    res.status(500).json({ error: 'Server error' });
  }
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

module.exports = router;
