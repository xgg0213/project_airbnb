import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrentSpots, deleteASpot, fetchAllSpots } from '../../store/spot';
import { Link, useNavigate } from 'react-router-dom';
import { useModal } from '../../context/Modal';
import './ManageSpots.css';

const ManageSpots = () => {
  const dispatch = useDispatch();
  const currentSpots = useSelector((state) => state.spot.currentSpots || {});
  const navigate = useNavigate();
  const { setModalContent, closeModal} = useModal();

  useEffect(() => {
    dispatch(fetchCurrentSpots());
  }, [dispatch]);

  const spotsArray = Object.values(currentSpots);
  if (!spotsArray.length) {
    return (
      <div className="no-spots">
      <p>You have not created any spots yet.</p>
      <Link to="/spots/new" className="create-spot-link">
        Create a New Spot
      </Link>
    </div>
    )
  }

  // handle delete spot - with pop up window
  // const handleDelete = async (spotId) => {
  //   const confirmed = window.confirm('Are you sure you want to delete this spot?');
  //   if (confirmed) {
  //     await dispatch(deleteASpot(spotId)); // Thunk for deleting a spot

  //   }
  // };

  // with modal
  const handleDeleteSpot = (spotId) => {
    setModalContent(
      <div className="confirmation-modal">
        <h2>Confirm Delete</h2>
        <p>Are you sure you want to remove this spot?</p>
        <div className="confirmation-buttons">
          <button
            className="confirm-delete-button"
            onClick={async () => {
              await dispatch(deleteASpot(spotId));
              dispatch(fetchAllSpots(spotId));
              closeModal();
            }}
          >
            Yes (Delete Spot)
          </button>
          <button className="cancel-delete-button" onClick={closeModal}>
            No (Keep Spot)
          </button>
        </div>
      </div>
    );
  };

  const handleUpdate = (spotId) => {
    navigate(`/spots/${spotId}/edit`); // Redirect to the edit page
  };

  const handleNavigate = (spotId) => {
    navigate(`/spots/${spotId}`);
  };

  return (
    <div className="manage-spots">
      <h1>Manage Spots</h1>
      <div className="spot-list">
        {spotsArray.map((spot) => (
          <div key={spot.id} className="spot-tile" onClick={() => handleNavigate(spot.id)}>
            {/* <Link to={`/spots/${spot.id}`} className="spot-link"> */}
              <div className="spot-content">
                <img
                  src={spot.previewImage || '/default-thumbnail.jpg'}
                  alt={`${spot.name} thumbnail`}
                  className="thumbnail-image"
                />
                <div className="spot-info">
                  <h3>{spot.name}</h3>
                  <p className="spot-location">
                    {spot.city}, {spot.state}
                  </p>
                  <p className="spot-rating">
                    <span className="star-icon">★</span>
                    {spot.avgRating ? spot.avgRating.toFixed(1) : 'New'}
                  </p>
                  <p className="spot-price">${spot.price} / night</p>
                </div>
                <div className="spot-actions">
                  <button
                    className="update-button"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent navigation to /spots/:spotId
                      console.log('Update button clicked'); // Debugging
                      handleUpdate(spot.id);
                    }}
                  >
                    Update
                  </button>
                  <button
                    className="delete-button"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent navigation to /spots/:spotId
                      console.log('Delete button clicked'); // Debugging
                      handleDeleteSpot(spot.id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
             {/* </Link> where link should be */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageSpots;