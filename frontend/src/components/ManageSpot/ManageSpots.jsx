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
      <div id="no-spots">
      <p>You have not created any spots yet.</p>
      <Link to="/spots/new" id="create-spot-link">
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
        <p>Are you sure you want to remove this spot from the listings?</p>
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

  const handleCreateSpot = () => {
    navigate('/spots/new')
  }

  return (
    <div className="manage-spots">
      <h1>Manage Your Spots</h1>
      <button 
        className='create-new-spot'
        onClick={(e) => {
          e.stopPropagation(); // Prevent navigation to /spots/:spotId
          handleCreateSpot();
        }}
      >
        Create a New Spot</button>
      <div className="spot-list">
        {spotsArray.map((spot) => (
          <div key={spot.id} className="spot-tile" onClick={() => handleNavigate(spot.id)}>

                <img
                  src={spot.previewImage || '/default-thumbnail.jpg'}
                  alt={`${spot.name} thumbnail`}
                  className="thumbnail-image"
                />

                <div className='spot-details-manage-spot'>
                  <div className="spot-location">
                    {spot.city}, {spot.state}
                  </div>
                  <div className="spot-rating">
                    <span className="star-icon">★</span>
                    {/* {spot.avgRating ? spot.avgRating.toFixed(1) : 'New'} */}
                    {spot.avgRating ? spot.avgRating : 'New'}
                  </div>
                </div>
                <div className="spot-price">${spot.price} / night</div>
  
                <div className="spot-actions">
                  <button
                    className="update-button"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent navigation to /spots/:spotId
  
                      handleUpdate(spot.id);
                    }}
                  >
                    Update
                  </button>
                  <button
                    className="delete-button"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent navigation to /spots/:spotId
                      handleDeleteSpot(spot.id);
                    }}
                  >
                    Delete
                  </button>
                </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageSpots;