import React from 'react';
import './QuantitySelector.css';

export default function QuantitySelector({ value, onChange }) {
  const handleDecrease = () => onChange(Math.max(1, value - 1));
  const handleIncrease = () => onChange(value + 1);

  return (
    <div className="quantity-selector">
      <button 
        type="button" 
        className="quantity-btn" 
        onClick={handleDecrease}
        aria-label="Decrease quantity"
      >
        -
      </button>
      
      <span className="quantity-value">
        {value}
      </span>
      
      <button 
        type="button" 
        className="quantity-btn" 
        onClick={handleIncrease}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}