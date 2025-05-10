import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header.jsx";
import LikeButton from "../components/LikeButton.jsx";
import Footer from "../components/Footer.jsx";
import EmojiPicker from 'emoji-picker-react';

const PostViewPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeComments, setActiveComments] = useState({});
  const [newComments, setNewComments] = useState({});
  const [editingComments, setEditingComments] = useState({});
  const [commentCounts, setCommentCounts] = useState({});
  const [showEmojiPicker, setShowEmojiPicker] = useState({});
  const [userId] = useState(1);
  const navigate = useNavigate();

  const fetchPosts = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/post/view");
      setPosts(response.data);
      
      const counts = {};
      response.data.forEach(post => {
        counts[post.id] = post.commentsCount || post.commentCount || 0;
      });
      setCommentCounts(counts);
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setLoading(false);
    }
  };

  const fetchComments = async (postId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/posts/${postId}/comments`);
      setActiveComments(prev => ({ ...prev, [postId]: response.data }));
      setCommentCounts(prev => ({ 
        ...prev, 
        [postId]: response.data.length 
      }));
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };
  
  useEffect(() => {
    fetchPosts();
  }, []);

  const toggleEmojiPicker = (postId) => {
    setShowEmojiPicker(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const addEmojiToComment = (postId, emojiData) => {
    setNewComments(prev => ({
      ...prev,
      [postId]: (prev[postId] || '') + emojiData.emoji
    }));
  };

  const validateComment = (text) => {
    return !/\d/.test(text);
  };

  const handleAddComment = async (postId) => {
    const commentText = newComments[postId]?.trim();
    
    if (!commentText) return;
    
    if (!validateComment(commentText)) {
      alert("Comments cannot contain numbers!");
      return;
    }
    
    try {
      await axios.post(`http://localhost:8080/api/posts/${postId}/comments`, null, {
        params: {
          userId,
          content: commentText
        }
      });
      
      setNewComments(prev => ({ ...prev, [postId]: '' }));
      fetchComments(postId);
      setCommentCounts(prev => ({ ...prev, [postId]: (prev[postId] || 0) + 1 }));
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleLike = async (postId) => {
    try {
      const hasLiked = await axios.get(`http://localhost:8080/api/posts/${postId}/like/status?userId=${userId}`);
      
      if (hasLiked.data) {
        await axios.delete(`http://localhost:8080/api/posts/${postId}/like?userId=${userId}`);
      } else {
        await axios.post(`http://localhost:8080/api/posts/${postId}/like?userId=${userId}`);
      }
      
      fetchPosts();
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleUpdateComment = async (postId, commentId) => {
    if (!editingComments[commentId]?.content?.trim()) return;
    
    try {
      await axios.put(`http://localhost:8080/api/posts/commentsupdate/${commentId}`, null, {
        params: {
          content: editingComments[commentId].content
        }
      });
      
      setEditingComments(prev => {
        const newState = { ...prev };
        delete newState[commentId];
        return newState;
      });
      fetchComments(postId);
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        await axios.delete(`http://localhost:8080/api/posts/commentsdelete/${commentId}`);
        fetchComments(postId);
        setCommentCounts(prev => ({ ...prev, [postId]: Math.max(0, (prev[postId] || 0) - 1) }));
      } catch (error) {
        console.error("Error deleting comment:", error);
      }
    }
  };

  const toggleComments = (postId) => {
    if (activeComments[postId]) {
      setActiveComments(prev => {
        const newState = { ...prev };
        delete newState[postId];
        return newState;
      });
    } else {
      fetchComments(postId);
    }
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await axios.delete(`http://localhost:8080/api/post/delete/${postId}`);
        fetchPosts();
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    }
  };

  const handleUpdatePost = (postId) => {
    navigate(`/post-update/${postId}`);
  };

  return (
    <div style={styles.pageWrapper}>
      <Header />
      <div style={styles.description}>
        <h2 style={styles.descriptionTitle}>Welcome to the Post View Page</h2>
        <p style={styles.descriptionText}>
          Explore posts from instructors and students. Enroll in courses, follow
          creators, and engage with content!
        </p>
        <div style={styles.createPostButtonContainer}>
          <button 
            onClick={() => navigate('/post-create')}
            style={styles.createPostButton}
          >
            + Create New Post
          </button>
        </div>
      </div>
      {loading ? (
        <p style={styles.loadingText}>Loading posts...</p>
      ) : posts.length === 0 ? (
        <p style={styles.noPostsText}>No posts available.</p>
      ) : (
        <div style={styles.postContainer}>
          {posts.map((post) => (
            <div key={post.id} style={styles.postCard}>
              <h3 style={styles.postTitle}>{post.title}</h3>
              <p style={styles.postDescription}>{post.description}</p>
              
              <div style={styles.mediaContainer}>
                {post.image1 && (
                  <div style={styles.mediaWrapper}>
                    <img
                      src={`http://localhost:8080/uploads/${post.image1}`}
                      alt="Image 1"
                      style={styles.media}
                      onError={(e) =>
                        (e.target.src =
                          "https://via.placeholder.com/200?text=Image+Not+Found")
                      }
                    />
                  </div>
                )}
              </div>

              <div style={styles.interactionSection}>
                <LikeButton 
                  postId={post.id.toString()} 
                  userId={userId} 
                />
                
                <button 
                  onClick={() => toggleComments(post.id)}
                  style={styles.commentToggleButton}
                >
                  💬 Comments ({commentCounts[post.id] || 0})
                </button>
              </div>

              {activeComments[post.id] && (
                <div style={styles.commentsSection}>
                  <div style={styles.commentList}>
                    {activeComments[post.id].map(comment => (
                      <div key={comment.id} style={styles.commentItem}>
                        {editingComments[comment.id] ? (
                          <div style={styles.commentEditForm}>
                            <textarea
                              value={editingComments[comment.id].content}
                              onChange={(e) => setEditingComments(prev => ({
                                ...prev,
                                [comment.id]: {
                                  ...prev[comment.id],
                                  content: e.target.value
                                }
                              }))}
                              style={styles.commentEditInput}
                            />
                            <div style={styles.commentEditActions}>
                              <button 
                                onClick={() => handleUpdateComment(post.id, comment.id)}
                                style={styles.saveButton}
                              >
                                Save
                              </button>
                              <button 
                                onClick={() => setEditingComments(prev => {
                                  const newState = { ...prev };
                                  delete newState[comment.id];
                                  return newState;
                                })}
                                style={styles.cancelButton}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <p style={styles.commentContent}>{comment.content}</p>
                            <div style={styles.commentMeta}>
                              <span>By User {comment.userId}</span>
                              <span>{new Date(comment.createdAt).toLocaleString()}</span>
                              {comment.userId === userId && (
                                <div style={styles.commentActions}>
                                  <button 
                                    onClick={() => setEditingComments(prev => ({
                                      ...prev,
                                      [comment.id]: {
                                        postId: post.id,
                                        content: comment.content
                                      }
                                    }))}
                                    style={styles.editButton}
                                  >
                                    Edit
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteComment(post.id, comment.id)}
                                    style={styles.deleteCommentButton}
                                  >
                                    Delete
                                  </button>
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <div style={styles.addCommentSection}>
                    <div style={styles.commentInputContainer}>
                      <textarea
                        value={newComments[post.id] || ''}
                        onChange={(e) => setNewComments(prev => ({
                          ...prev,
                          [post.id]: e.target.value
                        }))}
                        placeholder="Write a comment (no numbers allowed)..."
                        style={styles.commentInput}
                        onKeyDown={(e) => {
                          if (e.key >= '0' && e.key <= '9') {
                            e.preventDefault();
                          }
                        }}
                      />
                      <button 
                        onClick={() => toggleEmojiPicker(post.id)}
                        style={styles.emojiButton}
                      >
                        😊
                      </button>
                    </div>
                    
                    {showEmojiPicker[post.id] && (
                      <div style={styles.emojiPickerContainer}>
                        <EmojiPicker
                          onEmojiClick={(emojiData) => {
                            addEmojiToComment(post.id, emojiData);
                            setShowEmojiPicker(prev => ({ ...prev, [post.id]: false }));
                          }}
                          width={300}
                          height={350}
                        />
                      </div>
                    )}
                    
                    {newComments[post.id] && !validateComment(newComments[post.id]) && (
                      <p style={styles.validationError}>
                        Comments cannot contain numbers!
                      </p>
                    )}
                    
                    <button
                      onClick={() => handleAddComment(post.id)}
                      disabled={!newComments[post.id]?.trim()}
                      style={styles.addCommentButton}
                    >
                      Post Comment
                    </button>
                  </div>
                </div>
              )}

              <div style={styles.buttonContainer}>
                <button
                  onClick={() => handleUpdatePost(post.id)}
                  style={styles.updateButton}
                >
                  Update Post
                </button>
                <button
                  onClick={() => handleDeletePost(post.id)}
                  style={styles.deleteButton}
                >
                  Delete Post
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <Footer />
    </div>
  );
};

// 
const styles = {
  pageWrapper: {
    backgroundColor: '#f5f7fa',
    minHeight: '100vh',
    paddingBottom: '50px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  description: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '40px 20px',
    textAlign: 'center',
    color: '#333',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)',
    borderRadius: '0 0 20px 20px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
    marginBottom: '40px',
  },
  descriptionTitle: {
    fontSize: '2.2rem',
    fontWeight: '700',
    marginBottom: '15px',
    color: '#2c3e50',
    background: 'linear-gradient(to right, #3498db, #2ecc71)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    display: 'inline-block',
  },
  descriptionText: {
    fontSize: '1.1rem',
    lineHeight: '1.7',
    color: '#5d6d7e',
    maxWidth: '600px',
    margin: '0 auto 25px',
  },
  loadingText: {
    textAlign: 'center',
    fontSize: '1.2rem',
    color: '#7f8c8d',
    marginTop: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
  },
  noPostsText: {
    textAlign: 'center',
    fontSize: '1.2rem',
    color: '#7f8c8d',
    marginTop: '50px',
    padding: '30px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
    maxWidth: '500px',
    margin: '50px auto',
  },
  postContainer: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '0 20px',
  },
  postCard: {
    backgroundColor: 'white',
    borderRadius: '15px',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.08)',
    padding: '30px',
    marginBottom: '35px',
    transition: 'transform 0.3s, box-shadow 0.3s',
    border: '1px solid rgba(0, 0, 0, 0.05)',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.12)',
    },
  },
  postTitle: {
    fontSize: '1.6rem',
    fontWeight: '700',
    marginBottom: '15px',
    color: '#2c3e50',
    paddingBottom: '15px',
    borderBottom: '2px solid #f0f3f6',
    position: 'relative',
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: '-2px',
      left: '0',
      width: '100px',
      height: '2px',
      background: 'linear-gradient(to right, #3498db, #2ecc71)',
    },
  },
  postDescription: {
    fontSize: '1.05rem',
    lineHeight: '1.8',
    color: '#34495e',
    marginBottom: '25px',
    whiteSpace: 'pre-line',
  },
  mediaContainer: {
    margin: '25px 0',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
  },
  mediaWrapper: {
    flex: '1 1 300px',
    maxHeight: '450px',
    overflow: 'hidden',
    borderRadius: '12px',
    boxShadow: '0 3px 10px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s',
    position: 'relative',
    '&:hover': {
      transform: 'scale(1.02)',
    },
  },
  media: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.5s',
    display: 'block',
  },
  interactionSection: {
    display: 'flex',
    gap: '25px',
    margin: '25px 0',
    alignItems: 'center',
    borderTop: '1px solid #f0f3f6',
    borderBottom: '1px solid #f0f3f6',
    padding: '15px 0',
  },
  commentToggleButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1rem',
    color: '#555',
    padding: '10px 20px',
    borderRadius: '25px',
    transition: 'all 0.3s',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    backgroundColor: '#f8f9fa',
    '&:hover': {
      backgroundColor: '#e9f5ff',
      color: '#3498db',
      transform: 'translateY(-2px)',
    },
    '&:active': {
      transform: 'translateY(0)',
    },
  },
  commentsSection: {
    marginTop: '25px',
    borderTop: '1px solid #eee',
    paddingTop: '25px',
    position: 'relative',
  },
  commentList: {
    marginBottom: '25px',
    maxHeight: '400px',
    overflowY: 'auto',
    paddingRight: '15px',
    '&::-webkit-scrollbar': {
      width: '8px',
    },
    '&::-webkit-scrollbar-track': {
      background: '#f1f1f1',
      borderRadius: '10px',
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#c1c1c1',
      borderRadius: '10px',
    },
    '&::-webkit-scrollbar-thumb:hover': {
      background: '#a8a8a8',
    },
  },
  commentItem: {
    padding: '20px',
    marginBottom: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
    transition: 'all 0.3s',
    position: 'relative',
    '&:hover': {
      backgroundColor: '#f1f3f5',
      boxShadow: '0 3px 10px rgba(0, 0, 0, 0.05)',
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      left: '0',
      top: '0',
      height: '100%',
      width: '4px',
      backgroundColor: '#3498db',
      borderTopLeftRadius: '12px',
      borderBottomLeftRadius: '12px',
    },
  },
  commentContent: {
    margin: '0 0 15px 0',
    fontSize: '1rem',
    lineHeight: '1.7',
    color: '#333',
    whiteSpace: 'pre-line',
  },
  commentMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.85rem',
    color: '#7f8c8d',
    flexWrap: 'wrap',
    gap: '10px',
  },
  commentActions: {
    display: 'flex',
    gap: '15px',
  },
  editButton: {
    background: 'none',
    border: 'none',
    color: '#3498db',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: '600',
    transition: 'all 0.2s',
    padding: '5px 10px',
    borderRadius: '4px',
    '&:hover': {
      backgroundColor: 'rgba(52, 152, 219, 0.1)',
    },
  },
  deleteCommentButton: {
    background: 'none',
    border: 'none',
    color: '#e74c3c',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: '600',
    transition: 'all 0.2s',
    padding: '5px 10px',
    borderRadius: '4px',
    '&:hover': {
      backgroundColor: 'rgba(231, 76, 60, 0.1)',
    },
  },
  commentEditForm: {
    marginBottom: '15px',
  },
  commentEditInput: {
    width: '100%',
    minHeight: '100px',
    padding: '15px',
    marginBottom: '15px',
    border: '1px solid #ddd',
    borderRadius: '10px',
    fontSize: '1rem',
    lineHeight: '1.6',
    resize: 'vertical',
    transition: 'all 0.3s',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    '&:focus': {
      outline: 'none',
      borderColor: '#3498db',
      boxShadow: '0 0 0 3px rgba(52, 152, 219, 0.2)',
    },
  },
  commentEditActions: {
    display: 'flex',
    gap: '15px',
    justifyContent: 'flex-end',
  },
  saveButton: {
    padding: '10px 20px',
    backgroundColor: '#2ecc71',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '600',
    transition: 'all 0.3s',
    boxShadow: '0 2px 5px rgba(46, 204, 113, 0.3)',
    '&:hover': {
      backgroundColor: '#27ae60',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 8px rgba(46, 204, 113, 0.4)',
    },
    '&:active': {
      transform: 'translateY(0)',
    },
  },
  cancelButton: {
    padding: '10px 20px',
    backgroundColor: '#95a5a6',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '600',
    transition: 'all 0.3s',
    '&:hover': {
      backgroundColor: '#7f8c8d',
      transform: 'translateY(-2px)',
      boxShadow: '0 2px 5px rgba(149, 165, 166, 0.3)',
    },
    '&:active': {
      transform: 'translateY(0)',
    },
  },
  addCommentSection: {
    marginTop: '30px',
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
  },
  commentInputContainer: {
    position: 'relative',
    width: '100%',
    marginBottom: '20px',
  },
  commentInput: {
    width: '93%',
    minHeight: '100px',
    padding: '15px 50px 15px 15px',
    border: '1px solid #ddd',
    borderRadius: '10px',
    fontSize: '1rem',
    lineHeight: '1.6',
    resize: 'vertical',
    transition: 'all 0.3s',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    '&:focus': {
      outline: 'none',
      borderColor: '#3498db',
      boxShadow: '0 0 0 3px rgba(52, 152, 219, 0.2)',
    },
    '&::placeholder': {
      color: '#bdc3c7',
      fontStyle: 'italic',
    },
  },
  emojiButton: {
    position: 'absolute',
    right: '15px',
    top: '15px',
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    padding: '5px',
    borderRadius: '50%',
    transition: 'all 0.3s',
    '&:hover': {
      transform: 'scale(1.2)',
    },
  },
  emojiPickerContainer: {
    position: 'absolute',
    zIndex: '1000',
    bottom: '100px',
    right: '0',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
  },
  validationError: {
    color: '#e74c3c',
    fontSize: '0.9rem',
    margin: '-15px 0 15px 0',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  },
  addCommentButton: {
    padding: '12px 25px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    transition: 'all 0.3s',
    boxShadow: '0 2px 5px rgba(52, 152, 219, 0.3)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    '&:hover': {
      backgroundColor: '#2980b9',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 8px rgba(52, 152, 219, 0.4)',
    },
    '&:active': {
      transform: 'translateY(0)',
    },
    '&:disabled': {
      backgroundColor: '#bdc3c7',
      cursor: 'not-allowed',
      transform: 'none',
      boxShadow: 'none',
    },
  },
  buttonContainer: {
    display: 'flex',
    gap: '20px',
    marginTop: '30px',
    justifyContent: 'flex-end',
    borderTop: '1px solid #f0f3f6',
    paddingTop: '20px',
  },
  updateButton: {
    padding: '12px 25px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    transition: 'all 0.3s',
    boxShadow: '0 2px 5px rgba(52, 152, 219, 0.3)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    '&:hover': {
      backgroundColor: '#2980b9',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 8px rgba(52, 152, 219, 0.4)',
    },
    '&:active': {
      transform: 'translateY(0)',
    },
  },
  deleteButton: {
    padding: '12px 25px',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    transition: 'all 0.3s',
    boxShadow: '0 2px 5px rgba(231, 76, 60, 0.3)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    '&:hover': {
      backgroundColor: '#c0392b',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 8px rgba(231, 76, 60, 0.4)',
    },
    '&:active': {
      transform: 'translateY(0)',
    },
  },
  createPostButtonContainer: {
    marginTop: '30px',
    display: 'flex',
    justifyContent: 'center',
  },
  createPostButton: {
    padding: '14px 30px',
    backgroundColor: '#2ecc71',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1.1rem',
    fontWeight: '600',
    transition: 'all 0.3s',
    boxShadow: '0 4px 8px rgba(46, 204, 113, 0.3)',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    '&:hover': {
      backgroundColor: '#27ae60',
      transform: 'translateY(-3px)',
      boxShadow: '0 6px 12px rgba(46, 204, 113, 0.4)',
    },
    '&:active': {
      transform: 'translateY(0)',
      boxShadow: '0 4px 8px rgba(46, 204, 113, 0.3)',
    },
  },
  // Animation for loading text
  '@keyframes pulse': {
    '0%': { opacity: 0.6 },
    '50%': { opacity: 1 },
    '100%': { opacity: 0.6 },
  },
  loadingDot: {
    animation: '$pulse 1.5s infinite ease-in-out',
    '&:nth-child(2)': {
      animationDelay: '0.2s',
    },
    '&:nth-child(3)': {
      animationDelay: '0.4s',
    },
  },
};

// Add this to your loading text JSX:
// <span style={styles.loadingText}>
//   Loading posts
//   <span style={styles.loadingDot}>.</span>
//   <span style={styles.loadingDot}>.</span>
//   <span style={styles.loadingDot}>.</span>
// </span>
export default PostViewPage;