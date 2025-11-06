import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Send, Image, Smile } from 'lucide-react';
import axios from 'axios';

const CreatePost = ({ onPostCreated }) => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError('Post content cannot be empty');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/posts', { content });
      
      if (response.data.success) {
        setContent('');
        if (onPostCreated) {
          onPostCreated(response.data.post);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post-card">
      <form onSubmit={handleSubmit}>
        <div className="create-post-header">
          <div className="create-post-avatar">
            {user && getInitials(user.name)}
          </div>
          <textarea
            className="create-post-textarea"
            placeholder="What do you want to talk about?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={loading}
            maxLength={5000}
          />
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="create-post-actions">
          <div className="create-post-icons">
            <button 
              type="button" 
              className="btn btn-icon btn-secondary"
              title="Add image (Coming soon)"
            >
              <Image size={20} />
            </button>
            <button 
              type="button" 
              className="btn btn-icon btn-secondary"
              title="Add emoji (Coming soon)"
            >
              <Smile size={20} />
            </button>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading || !content.trim()}
          >
            {loading ? 'Posting...' : 'Post'}
            <Send size={16} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;