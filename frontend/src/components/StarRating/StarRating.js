import { useState, useEffect } from 'react';
import classes from './starRating.module.css';
export default function StarRating({ stars, size, editable = false, onRatingChange  }) {
  const [hoverRating, setHoverRating] = useState(0);
  const [currentStars, setCurrentStars] = useState(stars);

  useEffect(() => {
    setCurrentStars(stars);
  }, [stars]);
  
  const styles = {
    width: size + 'px',
    height: size + 'px',
    marginRight: size / 6 + 'px',
    cursor: editable ? 'pointer' : 'default'
  };

  function handleStarClick(number) {
    if (!editable) return;
    
    // Nếu click vào sao hiện tại thì reset về 0
    if (number === currentStars) {
      setCurrentStars(0);
      if (onRatingChange) onRatingChange(0);
    } else {
      setCurrentStars(number);
      if (onRatingChange) onRatingChange(number);
    }
  }

  function Star({ number }) {
    const halfNumber = number - 0.5;
    const displayRating = hoverRating || currentStars;
    const isActive = editable ? hoverRating >= number || (!hoverRating && currentStars >= number) : stars >= number;

    return (
      <span
        onClick={() => handleStarClick(number)}
        onMouseEnter={() => editable && setHoverRating(number)}
        onMouseLeave={() => editable && setHoverRating(0)}
      >
        {displayRating >= number ? (
          <img src="/star-full.svg" style={styles} alt={number} />
        ) : displayRating >= halfNumber ? (
          <img src="/star-half.svg" style={styles} alt={number} />
        ) : (
          <img src="/star-empty.svg" style={styles} alt={number} />
        )}
      </span>
    );
  }

  return (
    <div className={classes.rating}>
      {[1, 2, 3, 4, 5].map(number => (
        <Star key={number} number={number} />
      ))}
    </div>
  );
}

StarRating.defaultProps = {
  size: 18,
  editable: false
};
