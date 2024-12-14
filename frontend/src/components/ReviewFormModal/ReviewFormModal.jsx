import { useState } from 'react';
import { useDispatch } from 'react-redux';
// import { useModal } from '../../context/Modal';
import { createReview } from '../../store/review';
import './ReviewForm.css';

function ReviewFormModal({ closeModal, spotId, onReviewAdded }) {
  const dispatch = useDispatch();
  // const sessionUser = useSelector((state) => state.session.user);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [errors, setErrors] = useState({});
  const [serverErrors, setServerErrors] = useState('');


  const handleSubmit = async(e) => {
    e.preventDefault();
    setErrors({});
    setServerErrors('');

    // Validate inputs
    const validationErrors = {};
    if (rating <= 0) validationErrors.rating = 'Rating is required';
    if (review.length < 10) validationErrors.review = 'Review must be at least 10 characters';

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // handle server error
    const reviewData = { review, stars: rating };
    const result = await dispatch(createReview(spotId, reviewData));

      if (result && result.errors) {
        setServerErrors(result.errors.message || 'An unexpected error occurred.');
      } else {
        // Add the review to the Redux state
        if (onReviewAdded) onReviewAdded(); // Notify parent component
        closeModal(); // Close the modal on success
      }
    };    
  
    // validate if a review is qualified
    const isSubmitDisabled = review.length < 10 || rating <= 0;
  
    return (
    <div className="review-form-modal">
      <h2>How was your stay?</h2>
      {serverErrors && <p className="server-error">{serverErrors}</p>}
      <form onSubmit={handleSubmit}>
        {/* <label> */}
          {/* Comment */}
          <textarea
            placeholder="Leave your review here..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
          ></textarea>
          {errors.review && <p className="field-error">{errors.review}</p>}
        {/* </label> */}
        <div className="star-rating">
          
          <div className="stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <label key={star} className='star-label'>
                <input
                  type="radio"
                  name="rating"
                  value={star}
                  checked={rating === star}
                  onChange={() => setRating(star)}
                />
                <span className="star">★</span>
              </label>
            ))}
          </div>
          <h3>Stars</h3>
          {errors.rating && <p className="field-error">{errors.rating}</p>}
        </div>
        <button type="submit" disabled={isSubmitDisabled}>
          Submit Your Review
        </button>
      </form>
    </div>
  )
}


export default ReviewFormModal;