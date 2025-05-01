import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classes from './NewsPage.module.css';
import { getAllRecipes } from '../../services/recipeService';

function NewsPage() {
    const [recipes, setRecipes] = useState([]); 
    const navigate = useNavigate();

    async function getRecipes() {
        try {
            let response = await getAllRecipes();
            setRecipes(response.data.recipes);
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        getRecipes();
    }, []);

    return (
        <div className={classes.container}>
            <h1>List of Recipes</h1>
            <div className={classes.recipe_list}>
                {recipes.map((recipe) => (
                    <div key={recipe.id} className={classes.card} onClick={() => navigate(`/news/${recipe.id}`)}>
                        <img src={recipe.image} alt={recipe.title} />
                        <h2>{recipe.title}</h2>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default NewsPage;
