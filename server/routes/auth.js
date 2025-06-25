const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/register', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Username already exists' });
  }
});
router.get('/profile/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// search
router.get('/search', async (req, res) => {
  const { query, currentUser } = req.query;

  try {
    const users = await User.find({
      username: {
        $regex: new RegExp(query, 'i'), 
        $ne: currentUser               
      }
    }).select('_id username avatarUrl'); 

    res.json(users);
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ error: 'Search failed' });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  res.json({ user: { _id: user._id, username: user.username } });
});


router.get('/', async (req, res) => {
  const { currentUser } = req.query;
  const users = await User.find({ username: { $ne: currentUser } });
  res.json(users);
});


module.exports = router;
