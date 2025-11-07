import React, { useState } from 'react';
import axios from 'axios';
import API_URL from '../config';

const PostCard = ({ post, onUpdated, onDeleted }) => {
  const [likeLoading, setLikeLoading] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editContent, setEditContent] = useState(post?.content || '');
  const [err, setErr] = useState('');

  const tokenHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  };

  const handleLike = async () => {
    setLikeLoading(true);
    setErr('');
    try {
      const res = await axios.post(`${API_URL}/api/posts/${post._id}/like`, null, tokenHeader());
      onUpdated && onUpdated(res.data.post);
    } catch (e) {
      setErr(e?.response?.data?.message || 'Failed to like');
    } finally {
      setLikeLoading(false);
    }
  };

  const handleEdit = async () => {
    if (!editContent.trim()) return;
    setErr('');
    try {
      const res = await axios.put(
        `${API_URL}/api/posts/${post._id}`,
        { content: editContent },
        tokenHeader()
      );
      onUpdated && onUpdated(res.data.post);
      setEditMode(false);
    } catch (e) {
      setErr(e?.response?.data?.message || 'Failed to update post');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this post?')) return;
    setErr('');
    try {
      await axios.delete(`${API_URL}/api/posts/${post._id}`, tokenHeader());
      onDeleted && onDeleted(post._id);
    } catch (e) {
      setErr(e?.response?.data?.message || 'Failed to delete post');
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setCommentLoading(true);
    setErr('');
    try {
      const res = await axios.post(
        `${API_URL}/api/posts/${post._id}/comment`,
        { text: commentText },
        tokenHeader()
      );
      onUpdated && onUpdated(res.data.post);
      setCommentText('');
    } catch (e) {
      setErr(e?.response?.data?.message || 'Failed to comment');
    } finally {
      setCommentLoading(false);
    }
  };

  const createdAt = post?.createdAt ? new Date(post.createdAt) : null;

  return (
    <div style={{ background: '#fff', padding: 16, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: 16 }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#e6f0ff', display: 'grid', placeItems: 'center', fontWeight: 700 }}>
          {post?.author?.name?.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase()}
        </div>
        <div>
          <div style={{ fontWeight: 600 }}>{post?.author?.name || 'User'}</div>
          {createdAt && <div style={{ fontSize: 12, color: '#666' }}>{createdAt.toLocaleString()}</div>}
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        {editMode ? (
          <>
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={3}
              style={{ width: '100%', padding: 10 }}
            />
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <button onClick={handleEdit}>Save</button>
              <button onClick={() => { setEditMode(false); setEditContent(post.content || ''); }}>Cancel</button>
            </div>
          </>
        ) : (
          <div style={{ whiteSpace: 'pre-wrap' }}>{post?.content}</div>
        )}
      </div>

      {err && <div style={{ color: 'crimson', marginTop: 8 }}>{err}</div>}

      <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
        <button onClick={handleLike} disabled={likeLoading}>
          {likeLoading ? 'Liking…' : `Like (${post?.likes?.length || 0})`}
        </button>
        <button onClick={() => setEditMode(true)}>Edit</button>
        <button onClick={handleDelete}>Delete</button>
      </div>

      <div style={{ marginTop: 12 }}>
        <strong>Comments ({post?.comments?.length || 0})</strong>
        <form onSubmit={handleComment} style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <input
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write a comment…"
            style={{ flex: 1, padding: 8 }}
            disabled={commentLoading}
          />
          <button type="submit" disabled={commentLoading || !commentText.trim()}>
            {commentLoading ? 'Posting…' : 'Comment'}
          </button>
        </form>
        <div style={{ marginTop: 8, display: 'grid', gap: 8 }}>
          {(post?.comments || []).map((c) => (
            <div key={c._id} style={{ background: '#f7f7f7', padding: 8, borderRadius: 8 }}>
              <div style={{ fontWeight: 600, fontSize: 13 }}>{c.author?.name || 'User'}</div>
              <div style={{ fontSize: 14, whiteSpace: 'pre-wrap' }}>{c.text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostCard;
