import axios from 'axios';

export async function getReviewsByFood(foodId, page = 1, limit = 10) {
  return axios.get(`/api/reviews/food/${foodId}?page=${page}&limit=${limit}`);
}

export async function createReview(foodId, reviewData) {
  return axios.post(`/api/reviews`, { ...reviewData, foodId });
}

export async function updateReview(reviewId, reviewData) {
  return axios.put(`/api/reviews/${reviewId}`, reviewData);
}

export async function deleteReview(reviewId) {
  return axios.delete(`/api/reviews/${reviewId}`);
}