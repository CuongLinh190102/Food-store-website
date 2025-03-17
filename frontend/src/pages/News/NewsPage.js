import { useEffect, useState } from 'react';
import axios from 'axios';
import classes from './NewsPage.module.css';

function NewsPage() {
    const [news, setNews] = useState();

    async function getRandomNew() {
        try{
            const apiKey = 'be49521b7de44426aa3df1a717bf2e94';
            let n = await axios.get(`https://api.spoonacular.com/recipes/random?apiKey=${apiKey}`);
            
            console.log(n.data);
            
            setNews(n.data.recipes[0]);
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        getRandomNew();
    }, []);

    return (
        <div className={classes.container}>
            <div className={classes.panel_2col}>
                <div className={classes.panel_col_first}>
                    <h1>
                        Name:
                        <a target="_blank" rel='noreferrer' href={news?.sourceUrl}> {news?.title}</a>
                    </h1>
                    <img src={news?.image} alt={news?.title} />
                </div>
                <div className={classes.panel_col_last}>
                    <button onClick={getRandomNew}>Get Random Recipe News</button>
                </div>
            </div>
            
            <div className={classes.ingredients}>
                <h2> Ingredients needed:</h2>
                {news?.extendedIngredients.map((ingredient, index) => 
                    <span key={index}>
                        {index !== news?.extendedIngredients.length - 1 ? ingredient.original + ', ' : ingredient.original}
                    </span>
                )}
            </div>
            <div className={classes.preparation}>
                <h2>Preparation</h2>
                {news?.analyzedInstructions.map((instruction) =>
                    <div className={classes.steps}>
                        {instruction.steps.map((step, index) =>
                            <div>
                                <div className={classes.step_number} key={index}>
                                    {step.number}. 
                                </div>
                                <div className={classes.step_body}>
                                {step.step}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default NewsPage;