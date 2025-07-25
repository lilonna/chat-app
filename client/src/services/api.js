import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:3001' });
export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);
export const getUsers = (currentUser) => API.get(`/auth?currentUser=${currentUser}`);
export const fetchMessages = () => API.get('/messages');
export const getConversations = (username) => API.get(`/messages/conversations/${username}`);
export const getConversation = (user1, user2) => API.get(`/messages/${user1}/${user2}`);
export const searchUsers = (query, currentUser) => API.get(`/auth/search?query=${query}&currentUser=${currentUser}`);
export const getFeed = (userId) => API.get(`/api/posts/post/feed?userId=${userId}`);
export const getUserProfile = (username) => API.get(`/auth/profile/${username}`);


