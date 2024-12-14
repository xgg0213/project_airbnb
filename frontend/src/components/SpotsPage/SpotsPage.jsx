import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllSpots } from '../../store/spot';
import { NavLink } from 'react-router-dom';
import './SpotsPage.css'

const SpotsPage = () => {
  const dispatch = useDispatch();
  const spots = useSelector((state) => state.spot?state.spot.allSpots: null);

  useEffect(() => {
    dispatch(fetchAllSpots());
  }, [dispatch]);

  const spots_array=Object.values(spots);

  if (!spots_array.length) return <p>No spots available</p>;

  return (
    <div className='spots-page'>
        <h1>Explore Spots</h1>
        <div className="spots-grid">
        {spots_array.map((spot) => (
          <NavLink to={`/spots/${spot.id}`} className="spot-link" key={spot.id}>
            <div className="spot-tile-spot-page" data-tooltip={spot.name}>
              {/* <div className="spot-tooltip">{spot.name}</div>  */}
              <img
                src={spot.previewImage}
                alt={`${spot.city}, ${spot.state}`}
                className="spot-image"
              />
              <div id="spot-tile-description">
                <h3>{spot.city}, {spot.state}</h3>
                <div className="spot-name-rating">
                  <p className="star-rating">
                    <span className="star-icon">★</span>
                    {/* {spot.avgRating ? spot.avgRating.toFixed(1) : 'New'} */}
                    {spot.avgRating ? spot.avgRating : 'New'}
                  </p>
                </div>
              </div>
              <div id="price">${spot.price} night</div>
            </div>
            
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default SpotsPage; 