import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import classes from './NewsDetail.module.css';
import { getRecipeById } from '../../services/recipeService';

function NewsDetail() {
    const { id } = useParams();
    const [recipe, setRecipe] = useState(null);
 // Khi component được render lần đầu hoặc id thay đổi, gọi API lấy chi tiết công thức
    useEffect(() => {
        async function fetchRecipeDetail() {
            try {
                let response = await getRecipeById(id);
                setRecipe(response.data);
            } catch (e) {
                console.log(e);
            }
        }

        fetchRecipeDetail();
    }, [id]);

    if (!recipe) return <p>Loading...</p>;

    console.log(recipe);

    return (
        <div className={classes["recipe-detail"]}>
          <h1 className={classes["recipe-title"]}>{recipe.title}</h1>
          <img
            src={recipe.image}
            alt={recipe.title}
            className={classes["recipe-image"]}
          />
          <p 
            className={classes["recipe-description"]}
            dangerouslySetInnerHTML={{ __html: recipe.summary }}
          ></p>
    
          <div className={classes["recipe-info"]}>
            <p><strong>Prep Time:</strong> {recipe.preparationMinutes} mins</p>
            <p><strong>Cook Time:</strong> {recipe.cookingMinutes} mins</p>
            <p><strong>Servings:</strong> {recipe.servings}</p>
          </div>
    
          <div className={classes["recipe-section"]}>
            <h3>Ingredients</h3>
            <ul className={classes["recipe-ingredients"]}>
              {recipe.extendedIngredients.map((ingredient, index) => (
                <li key={index}>{ingredient.original}</li>
              ))}
            </ul>
          </div>
    
            {recipe.analyzedInstructions.length > 0 && (
              <div className={classes["recipe-section"]}>
              <h3>Steps</h3>
              <ol className={classes["recipe-steps"]}>
                {recipe.analyzedInstructions[0].steps.map((step, index) => (
                  <li key={index}>{step.step}</li>
                ))}
              </ol>
              </div>
            )}
        </div>
    );
}

export default NewsDetail;
