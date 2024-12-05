import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSingleSpot } from '../../store/spot';
import { useParams } from 'react-router-dom';

const SpotDetails = () => {
  const { spotId } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchSingleSpot(spotId));
  }, [dispatch, spotId]);

  const spot = useSelector((state) => state.spot?state.spot.singleSpot:[]);

  if (!Object.entries(spot).length) return <p>Loading...</p>;

  // Reserve Button Handler
  const handleReserveClick = () => {
    alert('Feature coming soon');
  };


  return (
    <div>
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


      <div className="callout-box">
        <h3>Details</h3>
        <p>Price: ${spot.price} <span>night</span></p>
        <p>Rating: {spot.avgRating ? spot.avgRating.toFixed(1) : 'New'}</p>
        {/* Reserve Button */}
        <button className="reserve-button" onClick={handleReserveClick}>
          Reserve
        </button>
      </div>
    </div>
  );
};

export default SpotDetails;