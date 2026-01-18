import axios from 'axios';

const BASE_URL = 'https://dummyjson.com/recipes';

export const fetchRecipes = async () => {
  // Fetching generic recipes to simulate a menu
  const response = await axios.get(`${BASE_URL}?limit=12`); 
  return response.data.recipes;
};

export const createRecipe = async (newRecipe) => {
  const response = await axios.post(`${BASE_URL}/add`, newRecipe);
  return response.data;
};

export const updateRecipe = async ({ id, ...updatedData }) => {
  const response = await axios.put(`${BASE_URL}/${id}`, updatedData);
  return response.data;
};

export const deleteRecipe = async (id) => {
  const response = await axios.delete(`${BASE_URL}/${id}`);
  return response.data;
};