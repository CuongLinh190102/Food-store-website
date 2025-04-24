import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Price from '../../components/Price/Price';
import StarRating from '../../components/StarRating/StarRating';
import Tags from '../../components/Tags/Tags';
import { useCart } from '../../hooks/useCart';
import { getById } from '../../services/foodService';
import classes from './foodPage.module.css';
import NotFound from '../../components/NotFound/NotFound';
import { useAuth } from '../../hooks/useAuth';
import { addFavorite, removeFavorite } from '../../services/favoriteService';
import { io } from 'socket.io-client';
import { 
  getReviewsByFood, 
  createReview, 
  updateReview as updateReviewService,
  deleteReview as deleteReviewService
} from '../../services/reviewService';

export default function FoodPage() {
  const [food, setFood] = useState({});
  const [reviews, setReviews] = useState([]);
  const [avgStars, setAvgStars] = useState(0);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const { user } = useAuth();
  const socketRef = useRef(null);
  const [userReview, setUserReview] = useState(null);

  const handleAddToCart = () => {
    addToCart(food);
    navigate('/cart');
  };

  const loadFood = async () => {
    const foodData = await getById(id);
    setFood(foodData);
    setIsFavorite(user?.favorites?.includes(foodData.id));
  };

  const loadReviews = async (pageNum = 1) => {
    setLoading(true);
    try {
      const { data, total, avgStars: averageStars } = await getReviewsByFood(id, pageNum);
      setReviews(data.data);
      setAvgStars(averageStars);
      setTotalPages(Math.ceil(total / 10));
      setPage(pageNum);
      
      // Tìm review của user hiện tại nếu có
      if (user) {
        const userRev = data.data.find(r => r.userId._id === user.id);
        setUserReview(userRev);
        if (userRev) {
          setRating(userRev.stars);
          setComment(userRev.comment);
        } else {
          setRating(5);
          setComment('');
        }
      }
    } catch (err) {
      console.error('Failed to load reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    if (!comment.trim()) return;

    try {
      if (userReview) {
        // Update existing review
        await updateReviewService(userReview._id, {
          stars: rating,
          comment: comment.trim()
        });
      } else {
        // Create new review
        await createReview(id, {
          stars: rating,
          comment: comment.trim()
        });
      }
    } catch (err) {
      console.error('Failed to submit review:', err);
    }
  };

  const toggleFavorite = async () => {
    if (!user) return;
    try {
      if (isFavorite) {
        await removeFavorite(food.id);
      } else {
        await addFavorite(food.id);
      }
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
    }
  };

  const deleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    
    try {
      await deleteReviewService(reviewId);
      // Socket sẽ tự động cập nhật thông qua event 'review-update'
    } catch (err) {
      console.error('Failed to delete review:', err);
    }
  };

  useEffect(() => {
    if (!id) return;

    loadFood();
    loadReviews();

    const userData = JSON.parse(localStorage.getItem('user'));
    const token = userData?.token || '';

    socketRef.current = io('http://localhost:5000', {
      auth: {
        token: token
      }
    });

    socketRef.current.on('connect', () => {
      console.log('Socket connected!');
    });
    
    socketRef.current.on('disconnect', () => {
      console.log('Socket disconnected!');
    });
    
    socketRef.current.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
    });

    socketRef.current.emit('subscribe-food', id);

    socketRef.current.on('review-update', (data) => {
      if (data.foodId === id) {
        setAvgStars(data.avgStars);
        if (data.action === 'created') {
          setReviews(prev => [data.review, ...prev.slice(0, 9)]);
          if (data.review.userId._id === user?.id) {
            setUserReview(data.review);
          }
        } else if (data.action === 'updated') {
          setReviews(prev => prev.map(r => 
            r._id === data.review._id ? data.review : r
          ));
          if (data.review.userId._id === user?.id) {
            setUserReview(data.review);
          }
        } else if (data.action === 'deleted') {
          setReviews(prev => prev.filter(r => r._id !== data.review._id));
          if (data.review.userId._id === user?.id) {
            setUserReview(null);
            setRating(5);
            setComment('');
          }
        }
      }
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.off('review-update');
        socketRef.current.disconnect();
      }
    };
  }, [id, user]);

  return (
    <>
      {!food ? (
        <NotFound message="Food Not Found!" linkText="Back To Homepage" />
      ) : (
        <div className={classes.container}>
          <div className={classes.foodContent}>
            <div className={classes.imageContainer}>
              <img
                className={classes.image}
                src={`${food.imageUrl}`}
                alt={food.name}
              />
            </div>

            <div className={classes.details}>
              <div className={classes.header}>
                <span className={classes.name}>{food.name}</span>
                <span
                  onClick={toggleFavorite}
                  className={`${classes.favorite} ${
                    isFavorite ? '' : classes.not
                  }`}
                >
                  ❤
                </span>
              </div>
              <div className={classes.ratingContainer}>
                <div className={classes.starRating}>
                  <StarRating stars={food.stars || 0} size={25} />
                </div>
                <div className={classes.averageRating}>
                  {food.stars || 0}
                  <span>/5</span>
                </div>
              </div>

              <div className={classes.origins}>
                {food.origins?.map(origin => (
                  <span key={origin}>{origin}</span>
                ))}
              </div>

              <div className={classes.tags}>
                {food.tags && (
                  <Tags
                    tags={food.tags.map(tag => ({ name: tag }))}
                    forFoodPage={true}
                  />
                )}
              </div>

              <div className={classes.cook_time}>
                <span>
                  Time to cook about <strong>{food.cookTime}</strong> minutes
                </span>
              </div>

              <div className={classes.price}>
                <Price price={food.price} />
              </div>

              <button 
                className={classes.addToCartBtn}
                onClick={handleAddToCart}
              >Add To Cart</button>
            </div>
          </div>

          {/* Review Section */}
          <div className={classes.reviewSection}>
            <h3>Customer Reviews</h3>
            
            {user ? (
              <form onSubmit={handleSubmitReview} className={classes.reviewForm}>
                <div className={classes.ratingInput}>
                  <label>Your Rating:</label>
                  <StarRating 
                    stars={rating} 
                    size={25} 
                    editable={true} 
                    onRatingChange={setRating} 
                  />
                </div>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your thoughts about this food..."
                  className={classes.reviewTextarea}
                  rows={4}
                />
                <div className={classes.reviewButtons}>
                  <button type="submit" className={classes.submitReviewBtn}>
                    {userReview ? 'Update Review' : 'Submit Review'}
                  </button>
                  {userReview && (
                    <button 
                      type="button" 
                      onClick={() => deleteReview(userReview._id)}
                      className={classes.deleteReviewBtn}
                    >
                      Delete Review
                    </button>
                  )}
                </div>
              </form>
            ) : (
              <p className={classes.loginPrompt}>
                Please <button onClick={() => navigate('/login')}>login</button> to leave a review.
              </p>
            )}

            {loading ? (
              <div className={classes.loading}>Loading reviews...</div>
            ) : reviews.length === 0 ? (
              <p className={classes.noReviews}>No reviews yet. Be the first to review!</p>
            ) : (
              <div className={classes.reviewsList}>
                {reviews.map((review) => (
                  <div key={review._id} className={classes.reviewItem}>
                    <div className={classes.reviewHeader}>
                      <img 
                        src={review.userId.avatar || ''} 
                        alt={review.userId.name} 
                        className={classes.reviewAvatar}
                      />
                      <div>
                        <h4>{review.userId.name}</h4>
                        <StarRating stars={review.stars} size={16} />
                        <span className={classes.reviewDate}>
                          {new Date(review.createdAt).toLocaleDateString()}
                          {review.updatedAt && review.updatedAt !== review.createdAt && (
                            <span className={classes.editedBadge}> (edited)</span>
                          )}
                        </span>
                      </div>
                    </div>
                    <p className={classes.reviewComment}>{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
            {totalPages > 1 && (
              <div className={classes.pagination}>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => loadReviews(pageNum)}
                    className={`${classes.pageBtn} ${page === pageNum ? classes.active : ''}`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}