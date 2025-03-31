import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import classes from './NewsDetail.module.css';

function NewsDetail() {
    const { id } = useParams();
    const [recipe, setRecipe] = useState(null);

    useEffect(() => {
        async function fetchRecipeDetail() {
            try {
                let response = await axios.get(`http://localhost:5000/api/recipes/${id}`);
                setRecipe(response.data);
            } catch (e) {
                console.log(e);
            }
        }

        fetchRecipeDetail();
    }, [id]);

    if (!recipe) return <p>Loading...</p>;

    return (
        <div className={classes["recipe-detail"]}>
          <h1 className={classes["recipe-title"]}>{recipe.title}</h1>
          <img
            src={recipe.image}
            alt={recipe.title}
            className={classes["recipe-image"]}
          />
          <p className={classes["recipe-description"]}>{recipe.description}</p>
    
          <div className={classes["recipe-info"]}>
            <p><strong>Prep Time:</strong> {recipe.prepTime} mins</p>
            <p><strong>Cook Time:</strong> {recipe.cookTime} mins</p>
            <p><strong>Servings:</strong> {recipe.servings}</p>
          </div>
    
          <div className={classes["recipe-section"]}>
            <h3>Ingredients</h3>
          </div>
    
          <div className={classes["recipe-section"]}>
            <h3>Steps</h3>
            <ol className={classes["recipe-steps"]}>
            </ol>
          </div>
        </div>
    );
}

export default NewsDetail;
