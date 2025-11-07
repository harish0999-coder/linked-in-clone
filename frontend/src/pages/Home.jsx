import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import CreatePost from '../components/CreatePost';
import Feed from '../components/Feed';
import axios from 'axios';
import API_URL from '../config';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/posts`);
      if (response.data.success) {
        setPosts(response.data.posts);
      }
    } catch (error) {
      console.error('Fetch posts error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  const handlePostUpdate = (updatedPost) => {
    setPosts(posts.map(post => 
      post._id === updatedPost._id ? updatedPost : post
    ));
  };

  const handlePostDelete = (postId) => {
    setPosts(posts.filter(post => post._id !== postId));
  };

  return (
    <>
      <Navbar />
      <div className="home-container">
        <div className="feed-layout">
          <CreatePost onPostCreated={handlePostCreated} />
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
            {posts.map(post => (
              <div key={post._id}>
                {/* PostCard will be rendered by Feed component */}
              </div>
            ))}
          </div>

          <Feed />
        </div>
      </div>
    </>
  );
};

export default Home;
