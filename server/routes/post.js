router.post('/post', upload.single('image'), async (req, res) => { /* create post */ });
router.get('/post/feed', async (req, res) => { /* get feed */ });
router.post('/post/like/:id', async (req, res) => { /* like/unlike */ });
router.post('/post/comment/:id', async (req, res) => { /* add comment */ });