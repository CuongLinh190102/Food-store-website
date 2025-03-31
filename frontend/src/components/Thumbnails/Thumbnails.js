import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Price from '../Price/Price';
import StarRating from '../StarRating/StarRating';
import classes from './thumbnails.module.css';
import { useAuth } from '../../hooks/useAuth';
import { 
  getFavorites, 
  addFavorite, 
  removeFavorite 
} from '../../services/favoriteService';

export default function Thumbnails({ foods }) {
  const { user } = useAuth(); 
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const loadFavorites = async () => {
      if (user) {
        try {
          const favs = await getFavorites();
          setFavorites(Array.isArray(favs) ? favs : []); // Đảm bảo luôn là mảng
        } catch (error) {
          console.error('Error loading favorites:', error);
          setFavorites([]);
        }
      }
    };
    
    loadFavorites();
  }, [user]); // Chạy lại khi user thay đổi

  const toggleFavorite = async (foodId, e) => {
    e.preventDefault(); // Ngăn Link chuyển trang
    if (!user) return;

    try {
        const isFavorite = favorites.some(f => f.id === foodId);
        if (isFavorite) {
          await removeFavorite(foodId);
          setFavorites(favorites.filter(f => f.id !== foodId));
        } else {
          await addFavorite(foodId);
          setFavorites([...favorites, { id: foodId }]);
        }
      } catch (err) {
        console.error('Failed to toggle favorite:', err);
      }
  };

  return (
    <ul className={classes.list}>
      {foods.map(food => (
          <li key={food.id}>
            <Link to={`/food/${food.id}`}>
              <img
                className={classes.image}
                src={`${food.imageUrl}`}
                alt={food.name}
              />

              <div className={classes.content}>
                <div className={classes.name}>{food.name}</div>
                <span
                  onClick={(e) => toggleFavorite(food.id, e)}
                  className={`${classes.favorite} ${
                    favorites.some(f => f.id === food.id) ? '' : classes.not
                  }`}
                >
                  ❤
                </span>
                <div className={classes.stars}>
                  <StarRating stars={food.stars} />
                </div>
                <div className={classes.product_item_footer}>
                  <div className={classes.origins}>
                    {food.origins.map(origin => (
                      <span key={origin}>{origin}</span>
                    ))}
                  </div>
                  <div className={classes.cook_time}>
                    <span>🕒</span>
                    {food.cookTime}
                  </div>
                </div>
                <div className={classes.price}>
                  <Price price={food.price} />
                </div>
              </div>
            </Link>
          </li>
      ))}
    </ul>
  );
}
