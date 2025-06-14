const express = require('express');
const User = require('../models/User');
const router = express.Router();

router.get('/:id', async (req, res) => {
  const user = await User.findById(req.params.id).populate('followers following', 'username avatar');
  res.send(user);
});

router.post('/:id/follow', async (req, res) => {
  const user = await User.findById(req.params.id);
  const follower = await User.findById(req.body.followerId);

  if (!user.followers.includes(follower._id)) user.followers.push(follower);
  if (!follower.following.includes(user._id)) follower.following.push(user);

  await user.save();
  await follower.save();

  res.send({ user, follower });
});

module.exports = router;