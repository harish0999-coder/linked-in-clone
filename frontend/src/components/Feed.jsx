import React, { useEffect, useState } from 'react';
import PostCard from './PostCard';
import { Loader, TrendingUp } from 'lucide-react';
import axios from 'axios';
import API_URL from '../config';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/posts`);
      if (response.data.success) {
        setPosts(response.data.posts);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePostUpdate = (updatedPost) => {
    setPosts(posts.map(post => 
      post._id === updatedPost._id ? updatedPost : post
    ));
  };

  const handlePostDelete = (postId) => {
    setPosts(posts.filter(post => post._id !== postId));
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Loader className="spinner" size={32} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        {error}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="empty-state">
        <TrendingUp className="empty-state-icon" />
        <h3 className="empty-state-title">No posts yet</h3>
        <p className="empty-state-description">
          Be the first to share something with the community!
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
      {posts.map(post => (
        <PostCard
          key={post._id}
          post={post}
          onPostUpdate={handlePostUpdate}
          onPostDelete={handlePostDelete}
        />
      ))}
    </div>
  );
};

export default Feed;
