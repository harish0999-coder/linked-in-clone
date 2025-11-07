import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ThumbsUp, MessageCircle, Trash2, Edit2, Send } from 'lucide-react';
import axios from 'axios';
import API_URL from '../config';

const PostCard = ({ post, onPostUpdate, onPostDelete }) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (date) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffInSeconds = Math.floor((now - postDate) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return postDate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: postDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const handleLike = async () => {
    try {
      const response = await axios.post(`${API_URL}/api/posts/${post._id}/like`);
      if (response.data.success && onPostUpdate) {
        onPostUpdate(response.data.post);
      }
    } catch (error) {
      console.error('Like error:', error);
    }
  };

  const handleEdit = async () => {
    if (!editContent.trim()) return;

    try {
      const response = await axios.put(`${API_URL}/api/posts/${post._id}`, {
        content: editContent
      });
      
      if (response.data.success && onPostUpdate) {
        onPostUpdate(response.data.post);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Edit error:', error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      const response = await axios.delete(`${API_URL}/api/posts/${post._id}`);
      if (response.data.success && onPostDelete) {
        onPostDelete(post._id);
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const response = await axios.post(`${API_URL}/api/posts/${post._id}/comment`, {
        text: commentText
      });
      
      if (response.data.success && onPostUpdate) {
        onPostUpdate(response.data.post);
        setCommentText('');
        setShowComments(true);
      }
    } catch (error) {
      console.error('Comment error:', error);
    }
  };

  const isLiked = post.likes?.includes(user?.id);
  const isOwner = post.user?._id === user?.id;

  return (
    <div className="post-card">
      <div className="post-header">
        <div className="post-user-info">
          <div className="post-avatar">
            {post.user && getInitials(post.user.name)}
          </div>
          <div className="post-details">
            <span className="post-author">{post.user?.name}</span>
            <div className="post-meta">
              {formatDate(post.createdAt)}
            </div>
          </div>
        </div>

        {isOwner && (
          <div className="post-actions-menu">
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="btn btn-icon btn-secondary"
              title="Edit post"
            >
              <Edit2 size={16} />
            </button>
            <button 
              onClick={handleDelete}
              className="btn btn-icon btn-secondary"
              title="Delete post"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="mt-2">
          <textarea
            className="form-input w-full"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            rows={4}
            maxLength={5000}
          />
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
            <button onClick={handleEdit} className="btn btn-primary">
              Save Changes
            </button>
            <button 
              onClick={() => {
                setIsEditing(false);
                setEditContent(post.content);
              }}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="post-content">{post.content}</div>
      )}

      {post.image && (
        <img src={post.image} alt="Post" className="post-image" />
      )}

      <div className="post-stats">
        <span>{post.likes?.length || 0} likes</span>
        <span>{post.comments?.length || 0} comments</span>
      </div>

      <div className="post-interactions">
        <button 
          onClick={handleLike}
          className={`interaction-btn ${isLiked ? 'liked' : ''}`}
        >
          <ThumbsUp size={20} fill={isLiked ? 'currentColor' : 'none'} />
          Like
        </button>
        <button 
          onClick={() => setShowComments(!showComments)}
          className="interaction-btn"
        >
          <MessageCircle size={20} />
          Comment
        </button>
      </div>

      {showComments && (
        <div className="comments-section">
          <form onSubmit={handleComment} className="comment-form">
            <input
              type="text"
              className="comment-input"
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              maxLength={500}
            />
            <button 
              type="submit" 
              className="btn btn-primary btn-icon"
              disabled={!commentText.trim()}
            >
              <Send size={16} />
            </button>
          </form>

          <div className="comments-list">
            {post.comments?.map((comment, index) => (
              <div key={index} className="comment-item">
                <div className="comment-avatar">
                  {comment.user && getInitials(comment.user.name)}
                </div>
                <div className="comment-content">
                  <div className="comment-author">{comment.user?.name}</div>
                  <div className="comment-text">{comment.text}</div>
                  <div className="comment-time">
                    {formatDate(comment.createdAt)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;
