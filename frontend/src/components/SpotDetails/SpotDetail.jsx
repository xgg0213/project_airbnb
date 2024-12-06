import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSingleSpot } from '../../store/spot';
import { fetchSpotReviews } from '../../store/review';
import { useParams } from 'react-router-dom';
import './SpotDetail.css'

const SpotDetails = () => {
  const { spotId } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchSingleSpot(spotId));
    dispatch(fetchSpotReviews(spotId))
  }, [dispatch, spotId]);

  const spot = useSelector((state) => state.spot?state.spot.singleSpot:{});
  const reviews = useSelector((state) => state.review ? state.review.spotReviews : {});
  const currentUser = useSelector((state) => state.session.user);
  const reviews_array = Object.values(reviews)
  if (!Object.entries(spot).length) return <p>Loading...</p>;

  // Reserve Button Handler
  const handleReserveClick = () => {
    alert('Feature coming soon');
  };

  const hasReviews = spot.numReviews && spot.numReviews > 0;
  const isOwner = currentUser?.id === spot.Owner?.id;
  
  // Sort reviews by newest
  const sortedReviews = reviews_array.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className='spot-details'>
      <h1>{spot?.name}</h1>

      <p className='location'>
        Location: {spot.city}, {spot.state}, {spot.country}
      </p>

      <div className="images-container">
        <img
          src={spot.SpotImages[0].url}
          alt={`${spot.name} large view`}
          className="large-image"
        />
        <div className="small-images">
          {spot.SpotImages.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`${spot.name} small view ${index + 1}`}
              className="small-image"
            />
          ))}
        </div>
      </div>
      
      <p className="hosted-by">
        Hosted by {spot.Owner.firstName} {spot.Owner.lastName}
      </p>

      <p className="description">{spot.description}</p>

      {/* callout info box */}
      <div className="callout-box">
        <h3>Details</h3>
        <p>Price: ${spot.price} <span>night</span></p>
        <p>Rating: 
          {spot.avgRating ? spot.avgRating.toFixed(1) : 'New'}
          {hasReviews && (
            <>
              <span className="dot">·</span> 
              {spot.numReviews} Review {spot.numReviews !== 1 ? 's' : ''}
            </>
          )}
        </p>
        {/* Reserve Button */}
        <button className="reserve-button" onClick={handleReserveClick}>
          Reserve
        </button>

        {/* Review Summary Info Before Reviews */}
        <div className="review-summary">
          <h2>
            <span className="star-icon">★</span>
            {spot.avgRating ? ` ${spot.avgRating.toFixed(1)}` : ' New'} 
            {hasReviews && (
            <>
              <span className="dot">·</span> 
              {spot.numReviews} Review {spot.numReviews !== 1 ? 's' : ''}
            </>
          )}
          </h2>
        </div>

        {/* Review Section */}
        <div className="reviews-section">
          <h3>Reviews</h3>
          {sortedReviews.length > 0 ? (
          sortedReviews.map((review) => (
            <div key={review.id} className="review-card">
              <p><strong>{review.User.firstName}</strong></p>
              <p>{review.review}</p>
              <p className="review-date">{new Date(review.createdAt).toLocaleString('default', { month: 'long', year: 'numeric' })}</p>
            </div>
          ))
        ) : currentUser && !isOwner ? (
          <p>Be the first to post a review!</p>
        ): (
          <p>No Reviews Yet</p>
        )}
        </div>
      </div>
    </div>
  );
};

export default SpotDetails;