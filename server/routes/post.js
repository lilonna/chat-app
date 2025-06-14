const express = require('express');
const router = express.Router();
const multer = require('multer');
const Post = require('../models/Post');
const User = require('../models/User');

const upload = multer({ dest: 'uploads/' });

router.post('/post', upload.single('image'), async (req, res) => {
  const post = new Post({
    author: req.body.author,
    content: req.body.content,
    image: req.file?.path
  });
  await post.save();
  res.json(post);
});

router.get('/post/feed', async (req, res) => {
  const user = await User.findById(req.query.userId);
  const posts = await Post.find({
    author: { $in: [...user.following, user._id] }
  }).sort({ timestamp: -1 }).populate('author').populate('comments.user');
  res.json(posts);
});

router.post('/post/like/:id', async (req, res) => {
  const post = await Post.findById(req.params.id);
  const userId = req.body.userId;

  if (post.likes.includes(userId)) {
    post.likes.pull(userId);
  } else {
    post.likes.push(userId);
  }
  await post.save();
  res.json(post);
});

router.post('/post/comment/:id', async (req, res) => {
  const post = await Post.findById(req.params.id);
  post.comments.push({
    user: req.body.userId,
    text: req.body.text
  });
  await post.save();
  res.json(post);
});

module.exports = router;