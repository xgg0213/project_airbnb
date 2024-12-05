import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllSpots } from '../../store/spot';
import { Link } from 'react-router-dom';
import './SpotsPage.css'

const SpotsPage = () => {
  const dispatch = useDispatch();
  const spots = useSelector((state) => state.spot?state.spot.allSpots: null);

  useEffect(() => {
    dispatch(fetchAllSpots());
  }, [dispatch]);
//   console.log(spots)
  const spots_array=Object.values(spots);

  if (!spots_array.length) return <p>No spots available</p>;

  return (
    <div className='spots-page'>
        <h1>Explore Spots</h1>
        <div className='spots-grid'>
            {spots_array.map((spot) => (
                <Link to={`/spots/${spot.id}`} 
                    className="spot-link" 
                    title={spot.name} // Tooltip text
                    key={spot.id}
                >
                    <div className='spot-tile' key={spot.id}>
                        <img src={spot.previewImage} 
                            alt={`${spot.city}, ${spot.state}`} className="thumbnail-image">
                        </img>
                        {/*  add spot name with star rating */}
                        <div className="spot-name-rating">
                            <h3>{spot.city}</h3>
                            <p className="star-rating">
                            <span className="star-icon">★</span>
                            {spot.avgRating ? spot.avgRating.toFixed(1) : 'New'}
                            </p>
                        </div>
                        <h3>{spot.city}</h3>
                        <p>{spot.state}</p>
                        <p className="price">${spot.price} night</p>
                    </div>
                </Link>
                
            ))}  
        </div>
    </div>
  );
};

export default SpotsPage; 