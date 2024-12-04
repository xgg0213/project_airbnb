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

  const spot = useSelector((state) => state.spot?state.spot:null);

  const spot_obj = Object.values(spot)[0];

  if (!Object.entries(spot_obj).length) return <p>Loading...</p>;

  return (
    <div>
      <h1>{spot_obj.name}</h1>
      <p>{spot_obj.description}</p>
      <p>{spot_obj.address}</p>
      <p>{spot_obj.city}</p>
      <p>{spot_obj.country}</p>
      <p>{spot_obj.price}</p>
      <p>{spot_obj.avgRating}</p>
    </div>
  );
};

export default SpotDetails;