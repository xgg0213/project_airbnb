import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllSpots } from '../../store/spot';
import { Link } from 'react-router-dom';
import './SpotsPage.css';

const SpotsPage = () => {
  const dispatch = useDispatch();
  const spots = useSelector((state) => state.spot?state.spot: null);

  useEffect(() => {
    dispatch(fetchAllSpots());
  }, [dispatch]);
  
  const spots_array=Object.values(spots);

  if (!spots_array.length) return <p>No spots available</p>;

  return (
    <div className='spots-page'>
        <h1>Explore Spots</h1>
        <div className='spots-grid'>
            {spots_array.map((spot) => (
                <Link to={`/spots/${spot.id}`} className="spot-link" key={spot.id}>
                    <div className='spot-tile' key={spot.id}>
                        <h3>{spot.name}</h3>
                        <p>{spot.description}</p>
                        <img src={spot.previewImage}></img>
                    </div>
                </Link>
                
            ))}  
        </div>
    </div>
  );
};

export default SpotsPage; 