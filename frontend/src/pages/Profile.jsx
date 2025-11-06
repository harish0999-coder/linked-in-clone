import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import PostCard from '../components/PostCard';
import { Loader, Mail, Calendar, Edit, ArrowLeft } from 'lucide-react';
import axios from 'axios';

const Profile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(true);

  // If no userId in URL, show current user's profile
  const profileUserId = userId || currentUser?.id;
  const isOwnProfile = !userId || userId === currentUser?.id;

  useEffect(() => {
    fetchProfile();
    fetchUserPosts();
  }, [profileUserId]);

  const fetchProfile = async () => {
    try {
      if (isOwnProfile) {
        setProfile(currentUser);
      } else {
        // In a real app, you'd fetch user data by ID
        // For now, we'll use current user data
        setProfile(currentUser);
      }
    } catch (error) {
      console.error('Fetch profile error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPosts = async () => {
    try {
      const response = await axios.get('/api/posts');
      if (response.data.success) {
        // Filter posts by current user
        const userPosts = response.data.posts.filter(
          post => post.user._id === profileUserId || post.user._id === currentUser?.id
        );
        setPosts(userPosts);
      }
    } catch (error) {
      console.error('Fetch posts error:', error);
    } finally {
      setPostsLoading(false);
    }
  };

  const handlePostUpdate = (updatedPost) => {
    setPosts(posts.map(post => 
      post._id === updatedPost._id ? updatedPost : post
    ));
  };

  const handlePostDelete = (postId) => {
    setPosts(posts.filter(post => post._id !== postId));
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="loading-container" style={{ minHeight: '80vh' }}>
          <Loader className="spinner" size={40} />
        </div>
      </>
    );
  }

  if (!profile) {
    return (
      <>
        <Navbar />
        <div className="empty-state">
          <h3 className="empty-state-title">Profile not found</h3>
          <button onClick={() => navigate('/')} className="btn btn-primary mt-2">
            Go Home
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="profile-container">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)} 
          className="btn btn-secondary mb-2"
          style={{ marginBottom: 'var(--spacing-md)' }}
        >
          <ArrowLeft size={18} />
          Back
        </button>

        {/* Profile Card */}
        <div className="profile-card">
          <div className="profile-header"></div>
          
          <div className="profile-info">
            <div className="profile-avatar-large">
              {getInitials(profile.name)}
            </div>

            <div className="profile-details">
              <h1 className="profile-name">{profile.name}</h1>
              
              <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-md)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)', color: 'var(--text-secondary)' }}>
                  <Mail size={18} />
                  <span className="profile-email">{profile.email}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)', color: 'var(--text-secondary)' }}>
                  <Calendar size={18} />
                  <span>Joined {formatDate(profile.createdAt || Date.now())}</span>
                </div>
              </div>

              {profile.bio ? (
                <p className="profile-bio">{profile.bio}</p>
              ) : (
                <p className="profile-bio" style={{ fontStyle: 'italic' }}>
                  No bio yet
                </p>
              )}

              {isOwnProfile && (
                <button className="btn btn-secondary mt-2">
                  <Edit size={18} />
                  Edit Profile
                </button>
              )}
            </div>

            {/* Stats */}
            <div className="profile-stats">
              <div className="profile-stat">
                <span className="profile-stat-value">{posts.length}</span>
                <span className="profile-stat-label">Posts</span>
              </div>
              <div className="profile-stat">
                <span className="profile-stat-value">
                  {posts.reduce((sum, post) => sum + (post.likes?.length || 0), 0)}
                </span>
                <span className="profile-stat-label">Likes</span>
              </div>
              <div className="profile-stat">
                <span className="profile-stat-value">
                  {posts.reduce((sum, post) => sum + (post.comments?.length || 0), 0)}
                </span>
                <span className="profile-stat-label">Comments</span>
              </div>
            </div>
          </div>
        </div>

        {/* User Posts */}
        <div className="profile-posts-section">
          <h2 className="profile-section-title">
            {isOwnProfile ? 'My Posts' : `${profile.name}'s Posts`}
          </h2>

          {postsLoading ? (
            <div className="loading-container">
              <Loader className="spinner" size={32} />
            </div>
          ) : posts.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)', maxWidth: '680px', margin: '0 auto' }}>
              {posts.map(post => (
                <PostCard
                  key={post._id}
                  post={post}
                  onPostUpdate={handlePostUpdate}
                  onPostDelete={handlePostDelete}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h3 className="empty-state-title">No posts yet</h3>
              <p className="empty-state-description">
                {isOwnProfile 
                  ? 'Start sharing your thoughts with the community!' 
                  : 'This user hasn\'t posted anything yet.'
                }
              </p>
              {isOwnProfile && (
                <button onClick={() => navigate('/')} className="btn btn-primary mt-2">
                  Create Your First Post
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;