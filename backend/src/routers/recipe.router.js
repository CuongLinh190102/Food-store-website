import { Router } from 'express';

const router = Router();

// SPOONACULAR
const recipeIds = [716429, 644387, 715415, 715538];

router.get('/', async (req, res) => {
  try {
    const apiKey = process.env.SPOONACULAR_API_KEY;
    const recipes = [];

    // Gửi request lấy thông tin từng công thức dựa trên ID
    for (const id of recipeIds) {
      const response = await fetch(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${apiKey}`);
      const data = await response.json();
      recipes.push(data);
    }

    res.json({ recipes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API lấy chi tiết công thức theo ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const apiKey = process.env.SPOONACULAR_API_KEY;

    const response = await fetch(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${apiKey}`);
    const data = await response.json();

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;