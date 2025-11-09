// components/Feed.jsx
import React, { useState, useEffect } from 'react';
import { postService } from '../services/api';
import PostCard from './PostCard';
import CreatePost from './CreatePost';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const response = await postService.getFeed();
      setPosts(response.data);
    } catch (error) {
      console.error('Erro ao carregar posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewPost = (newPost) => {
    setPosts(prev => [newPost, ...prev]);
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="feed">
      <CreatePost onPostCreated={handleNewPost} />
      
      <div className="posts-list">
        {posts.map(post => (
          <PostCard key={post.id_post} post={post} />
        ))}
      </div>
    </div>
  );
};

export default Feed;