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

  return (
    <div>
      <h1>{spot?.name}</h1>
      <p>
        Location: {spot.city}, {spot.state}, {spot.country}
      </p>

      <div>
        <img></img>
      </div>
      <p>{spot.description}</p>
      <p>{spot.address}</p>
      <p>{spot.city}</p>
      <p>{spot.country}</p>
      <p>{spot.price}</p>
      <p>{spot.avgRating}</p>
    </div>
  );
};

export default SpotDetails;