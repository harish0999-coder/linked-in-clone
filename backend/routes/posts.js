const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const auth = require('../middleware/auth');

// @route   GET /api/posts
// @desc    Get all posts
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('user', 'name email profileImage')
      .populate('comments.user', 'name profileImage')
      .sort({ createdAt: -1 })
      .limit(100);

    res.json({
      success: true,
      count: posts.length,
      posts
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching posts' 
    });
  }
});

// @route   POST /api/posts
// @desc    Create a new post
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { content, image } = req.body;

    // Validation
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Post content is required' 
      });
    }

    // Create post
    const post = await Post.create({
      user: req.user._id,
      content: content.trim(),
      image: image || ''
    });

    // Populate user info
    await post.populate('user', 'name email profileImage');

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      post
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error creating post' 
    });
  }
});

// @route   PUT /api/posts/:id
// @desc    Update a post
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const { content, image } = req.body;

    // Find post
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ 
        success: false, 
        message: 'Post not found' 
      });
    }

    // Check if user owns the post
    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to update this post' 
      });
    }

    // Update post
    post.content = content || post.content;
    post.image = image !== undefined ? image : post.image;
    await post.save();

    await post.populate('user', 'name email profileImage');

    res.json({
      success: true,
      message: 'Post updated successfully',
      post
    });
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating post' 
    });
  }
});

// @route   DELETE /api/posts/:id
// @desc    Delete a post
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ 
        success: false, 
        message: 'Post not found' 
      });
    }

    // Check if user owns the post
    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to delete this post' 
      });
    }

    await post.deleteOne();

    res.json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error deleting post' 
    });
  }
});

// @route   POST /api/posts/:id/like
// @desc    Like/Unlike a post
// @access  Private
router.post('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ 
        success: false, 
        message: 'Post not found' 
      });
    }

    // Check if already liked
    const likeIndex = post.likes.indexOf(req.user._id);

    if (likeIndex > -1) {
      // Unlike
      post.likes.splice(likeIndex, 1);
    } else {
      // Like
      post.likes.push(req.user._id);
    }

    await post.save();
    await post.populate('user', 'name email profileImage');

    res.json({
      success: true,
      message: likeIndex > -1 ? 'Post unliked' : 'Post liked',
      post
    });
  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error liking post' 
    });
  }
});

// @route   POST /api/posts/:id/comment
// @desc    Add a comment to a post
// @access  Private
router.post('/:id/comment', auth, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Comment text is required' 
      });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ 
        success: false, 
        message: 'Post not found' 
      });
    }

    post.comments.push({
      user: req.user._id,
      text: text.trim()
    });

    await post.save();
    await post.populate('user', 'name email profileImage');
    await post.populate('comments.user', 'name profileImage');

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      post
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error adding comment' 
    });
  }
});

module.exports = router;