import axios from "axios";

export async function getAllRecipes() {
  return axios.get("/api/recipes");
}

export async function getRecipeById(id) {
  return axios.get(`/api/recipes/${id}`);
}