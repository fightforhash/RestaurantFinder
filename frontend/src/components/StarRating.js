import React from 'react';

const StarRating = ({ 
  rating, 
  onRatingChange, 
  maxStars = 5, 
  size = 'md',
  readOnly = false,
  interactive = true
}) => {
  const stars = Array.from({ length: maxStars }, (_, index) => index + 1);
  
  const getStarSize = () => {
    switch (size) {
      case 'sm':
        return '1rem';
      case 'lg':
        return '1.5rem';
      default:
        return '1.25rem';
    }
  };

  const handleClick = (value) => {
    if (!readOnly && onRatingChange) {
      onRatingChange(value);
    }
  };

  return (
    <div className="d-flex align-items-center">
      {stars.map((star) => (
        <i
          key={star}
          className={`fas fa-star ${star <= rating ? 'text-warning' : 'text-muted'}`}
          style={{
            fontSize: getStarSize(),
            cursor: readOnly ? 'default' : 'pointer',
            transition: 'all 0.2s ease',
            opacity: interactive && !readOnly ? 1 : 0.8
          }}
          onClick={() => handleClick(star)}
          onMouseEnter={() => {
            if (interactive && !readOnly) {
              document.querySelectorAll('.fa-star').forEach((s, index) => {
                if (index < star) {
                  s.style.transform = 'scale(1.2)';
                }
              });
            }
          }}
          onMouseLeave={() => {
            if (interactive && !readOnly) {
              document.querySelectorAll('.fa-star').forEach(s => {
                s.style.transform = 'scale(1)';
              });
            }
          }}
        />
      ))}
    </div>
  );
};

export default StarRating; 