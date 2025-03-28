import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

// USER APIs
export const getUsers = () => API.get('/users');
export const createUser = (user) => API.post('/users', user);
export const deleteUser = (id) => API.delete(`/users/${id}`);
export const searchUsers = (query) =>
  API.get(`/users/search?${new URLSearchParams(query).toString()}`);
export const updateUser = (id, updatedUser) =>
  API.put(`/users/${id}`, updatedUser);

// PURCHASE APIs
export const getPurchases = () => API.get('/purchases');
export const createPurchase = (purchase) => API.post('/purchases', purchase);
export const deletePurchase = (id) => API.delete(`/purchases/${id}`);
export const updatePurchase = (id, updated) =>
  API.put(`/purchases/${id}`, updated);
