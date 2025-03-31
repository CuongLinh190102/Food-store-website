import axios from 'axios';

export const getFavorites = async () => {
  const { data } = await axios.get('/api/favorites');
  return data;
};

export const addFavorite = async foodId => {
  const { data } = await axios.post(`/api/favorites/${foodId}`);
  return data;
};

export const removeFavorite = async foodId => {
  await axios.delete(`/api/favorites/${foodId}`);
};