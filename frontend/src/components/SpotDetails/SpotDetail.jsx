import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSingleSpot } from '../../store/spot';
import { fetchSpotReviews } from '../../store/review';
import { useParams } from 'react-router-dom';
import { useModal } from '../../context/Modal';
import ReviewFormModal from '../ReviewFormModal';
import { deleteReview } from '../../store/review';
import './SpotDetail.css'

const SpotDetails = () => {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const { setModalContent, closeModal } = useModal();

  useEffect(() => {
    dispatch(fetchSingleSpot(spotId));
    dispatch(fetchSpotReviews(spotId))
  }, [dispatch, spotId]);

  const spot = useSelector((state) => state.spot?state.spot.singleSpot:{});
  const reviews = useSelector((state) => state.review ? state.review.spotReviews : {});
  const spotImages = spot.SpotImages||{}; 
  const currentUser = useSelector((state) => state.session.user);
  const reviews_array = Object.values(reviews);
  const images_array = Object.values(spotImages)
  
  if (!Object.entries(spot).length) return <p>Loading...</p>;

  // Reserve Button Handler
  const handleReserveClick = () => {
    alert('Feature coming soon');
  };
  // if the spot has reviews already
  const hasReviews = spot.numReviews && spot.numReviews > 0;
  // if the current session user is the owner
  const isOwner = currentUser?.id === spot.Owner?.id
  // console.log(spot)
  // Sort reviews by newest
  const sortedReviews = reviews_array.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  // if the current user has reviewed this spot
  const alreadyReviewed = reviews_array?.length
  ? reviews_array.find((r) => r.userId === currentUser?.id) !== undefined
  : false;

  // // post your review button handler
  // const handlePostReview = () => {
  //   alert('Redirect to Post Your Review form!'); // Replace with actual navigation logic
  // };

  const openReviewModal = () => {
    setModalContent(
      <ReviewFormModal
        spotId={spotId}
        closeModal={closeModal}
        onReviewAdded={() => {
          dispatch(fetchSingleSpot(spotId)); // Re-fetch spot details
          dispatch(fetchSpotReviews(spotId)); // Re-fetch reviews
        }}
      />
    );
  };

  // handle delete review
  // with pop up window
  // const handleDeleteReview = async (reviewId) => {
  //   const confirmed = window.confirm('Are you sure you want to delete this review?');
  //   if (confirmed) {
  //     await dispatch(deleteReview(reviewId));
  //     dispatch(fetchSpotReviews(spotId)); // Refresh reviews after deletion
  //   }
  // };

  // with modal
  const handleDeleteReview = (reviewId) => {
    setModalContent(
      <div className="confirmation-modal">
        <h2>Confirm Delete</h2>
        <p id='confirm-question'>Are you sure you want to delete this review?</p>
        <div className="confirmation-buttons">
          <button
            className="confirm-delete-button"
            onClick={async () => {
              await dispatch(deleteReview(reviewId));
              await dispatch(fetchSpotReviews(spotId));
              await dispatch(fetchSingleSpot(spotId)); // Re-fetch spot details
              closeModal();
            }}
          >
            Yes (Delete Review)
          </button>
          <button className="cancel-delete-button" onClick={closeModal}>
            No (Keep Review)
          </button>
        </div>
      </div>
    );
  };
  
  return (
    <div className='spot-details'>
      <h1>{spot?.name}</h1>

      <p className='location'>
        Location: {spot?.city}, {spot?.state}, {spot?.country}
      </p>

      <div className="images-container">
        <img
          src={images_array[0]?.url ||'' }
          alt={`${spot.name} large view`}
          className="large-image"
        />
        <div className="small-images">
          {images_array.slice(1).map((image, index) => (
            <img
              key={index}
              src={image?.url || ''}
              alt={`${spot.name} small view ${index + 1}`}
              className="small-image"
            />
          ))}
        </div>
      </div>
      
      <div className='details'>
        <div className='details-text'>
          <h4 className="hosted-by">
            Hosted by {spot.Owner?.firstName} {spot.Owner?.lastName}
          </h4>
          <p className="description">{spot.description}</p>
        </div>
        
        {/* callout info box */}
        <div className="callout-box">
          <div className='reviews-rating'>
            <p>${spot.price} night </p>
            <p>
            <span className="star-icon">★</span>
              {/* {spot.avgRating ? spot.avgRating.toFixed(1) : 'New'} */}
              {spot.avgRating ? spot.avgRating : 'New'}
              {hasReviews ? (
                <>
                  <span className="dot"> · </span> 
                  {spot.numReviews} Review{spot.numReviews !== 1 ? 's' : ''}
                </>
              ): null}
            </p>
          </div>
         
          {/* Reserve Button */}
          <button className="reserve-button" onClick={handleReserveClick}>
            Reserve
          </button>
        </div>
      </div>
      
      <hr className="divider" />
      

        {/* Review Summary Info Before Reviews */}
        <div className="review-summary">
          <h2>
            <span className="star-icon">★</span>
            {/* {spot.avgRating ? `${spot.avgRating.toFixed(1)}` : 'New'} */}
            {spot.avgRating ? `${spot.avgRating}` : 'New'}  
            {hasReviews && spot.numReviews > 0 ? (
              <>
                <span className="dot">·</span> 
                {spot.numReviews} Review{spot.numReviews === 1 ? '' : 's'}
              </>
            ) : null}
          </h2>
        </div>

        {/* Review Section */}
        <div className="reviews-section">
          {/* Conditionally show Post Your Review button */}
          {currentUser && !isOwner && !alreadyReviewed && (
            <button className="post-review-button" onClick={openReviewModal}>
              Post Your Review
            </button>
            
          )}

          {sortedReviews.length > 0 ? (
          sortedReviews.map((review) => (
            <div key={review.id} className="review-card">
              <p><strong>{review.User?.firstName}</strong></p>
              <p className="review-date">
                {new Date(review.createdAt).toLocaleString('default', { month: 'long', year: 'numeric' })}
              </p>
              <p>{review.review}</p>
              
              {currentUser?.id === review.userId && (
                <button
                  className="delete-review-button"
                  onClick={() => handleDeleteReview(review.id)}
                >
                  Delete
                </button>
              )}
            </div>
          ))
        ) : (
          <p>{currentUser && !isOwner ? 'Be the first to post a review!': 'No Reviews Yet'}</p>
        )}
        </div>
    </div>
  );
};

export default SpotDetails;