import { csrfFetch } from './csrf'

// use csrfFetch instead of simple fetch - allows authorization

// Action types
const LOAD_SPOTS = 'spots/LOAD_SPOTS';
const LOAD_SINGLE_SPOT = 'spots/LOAD_SINGLE_SPOT';
const LOAD_CURRENT_SPOTS = 'spots/LOAD_CURRENT_SPOTS' 
const ADD_SPOT = 'spots/ADD_SPOT';
const ADD_IMAGE = 'spots/ADD_IMAGE';
const DELETE_SPOT = 'spots/DELETE_SPOT';
const UPDATE_SPOT = 'spots/UPDATE_SPOT'

// Action creator
// Load all spots
const loadSpots = (spots) => ({
    type: LOAD_SPOTS,
    spots,
});
  
// Load a single spot
const loadSingleSpot = (spot) => ({
    type: LOAD_SINGLE_SPOT,
    spot,
});

// Load current user's spots
export const loadCurrentSpots = (spots) => ({
    type: LOAD_CURRENT_SPOTS,
    spots,
  });

// Delete a spot
export const deleteSpot = (spotId) => ({
    type: DELETE_SPOT,
    spotId,
  });

// Add a new spot
const addSpot = (spot) => ({
    type: ADD_SPOT,
    spot,
})

// Update a spot
const updateSpot = (spot) => ({
    type: UPDATE_SPOT,
    spot,
})

// Add an image to a spot
const addImage = (image) => ({
    type: ADD_IMAGE,
    image,
});


// Thunks
export const fetchAllSpots = () => async (dispatch) => {
    const response = await fetch('/api/spots');
    
    if (response.ok) {
      const spots = await response.json();
      const spots_new = {}
      spots.Spots.map(spot => {
        spots_new[spot.id]=spot
      })
      
      dispatch(loadSpots(spots_new));
    } else {
      console.error('Failed to fetch spots');
    }
};

export const fetchSingleSpot = (spotId) => async (dispatch) => {
    const response = await fetch(`/api/spots/${spotId}`, {
        method: 'GET',
    }); 

    if (response.ok) {
      const spot = await response.json();
      const spot_item = spot[0]
      const spot_new = {...spot_item};
      
      dispatch(loadSingleSpot(spot_new));
    } else {
      console.error('Failed to fetch spot details');
    }
};

export const fetchCurrentSpots = () => async (dispatch) => {
    const response = await csrfFetch('/api/spots/current');
    
    if (response.ok) {
      const currentSpots = await response.json();
      const spots_array = Object.values(currentSpots.Spots);
      const current_spots_new = {}
      spots_array.map(spot => {
        current_spots_new[spot.id]=spot
      })
    //   console.log(currentSpots);
    //   console.log(spots_array);
    //   console.log(current_spots_new)
      dispatch(loadCurrentSpots(current_spots_new));
    }
};

export const deleteASpot = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'DELETE',
    }); 

    if (response.ok) {
      
      dispatch(deleteSpot(spotId));
    } else {
      console.error('Failed to delete spot');
    }
};

export const updateASpot = (spotId, formData) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
    }); 

    if (response.ok) {
        const updatedSpot = await response.json();
        dispatch(dispatch(updateSpot(updatedSpot)));
        return updatedSpot;
    } else {
      console.error('Failed to delete spot');
    }
};

export const createSpot = (payload) => async(dispatch) => {
    const response = await csrfFetch('/api/spots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      if (response.ok) {
        const newSpot = await response.json();

        dispatch(addSpot(newSpot));
        return newSpot;
      }
};

// Add images to a spot
export const addImagesToSpot = (spotId, images) => async (dispatch) => {
    const imagesPromises = images.map(async (image) => {
      const response = await csrfFetch(`/api/spots/${spotId}/images`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(image),
      });
  
      if (response.ok) {
        const newImage = await response.json();
        console.log(newImage);
        dispatch(addImage(newImage));
        return newImage;
      } else {
        const errors = await response.json();
        console.error('Failed to add image:', image.url);
        return { errors };
      }
    });
    return imagesPromises;
}


// initial state
const initialState = {
    allSpots: {}, // List of all spots
    singleSpot: {}, // Details of a single spot
};

// Reducer
const spotReducer = (state = initialState, action) => {
    switch (action.type) {
      case LOAD_SPOTS: {
        const spotsState = {};
        const spots_array = Object.values(action.spots)
        spots_array.forEach((spot) => {
            spotsState[spot.id] = spot;
        });

        return {
            ...state,
            allSpots: {...spotsState}
        }
      }
        
      case LOAD_SINGLE_SPOT: {
        return {
            ...state,
            singleSpot: action.spot, 
          };
      }

      case LOAD_CURRENT_SPOTS: {
        const currentSpots = {};
        const currentSpotsArray = Object.values(action.spots);
        currentSpotsArray.forEach((spot) => {
            currentSpots[spot.id] = spot;
        });
        // console.log(action.spots)
        return {
            ...state,
            currentSpots: currentSpots,
        };
      }

      case DELETE_SPOT: {
        const newState = { ...state };

        // Remove from allSpots
        if (action.spotId && newState.allSpots[action.spotId]) {
            delete newState.allSpots[action.spotId];
        }

        // Remove spot from userSpots if it exists
        if (newState.userSpots[action.spotId]) {
            delete newState.userSpots[action.spotId];
        }

        // Clear singleSpot if it matches the deleted spot
        if (newState.singleSpot.id === action.spotId) {
            newState.singleSpot = {};
        }

        return newState;
      }

      case ADD_SPOT: {
        return {
            ...state,
            allSpots: {
                ...state.allSpots,
                [action.spot.id]: action.spot
            }
        }
      }

      case UPDATE_SPOT: {
        return {
            ...state,
            allSpots: {
                ...state.allSpots,
                [action.spot.id]: action.spot
            },
            singleSpot: {
                ...action.spot,
              },
        }
      }

      case ADD_IMAGE: {
        return {
          ...state,
          singleSpot: {
            ...state.singleSpot,
            SpotImages: [...(state.singleSpot.SpotImages || []), action.image],
          },
        };
      }

        
      default:
        return state;
    }
  };
  
export default spotReducer;