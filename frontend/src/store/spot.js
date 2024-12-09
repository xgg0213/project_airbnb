import { csrfFetch } from './csrf'

// use csrfFetch instead of simple fetch - allows authorization

// Action types
const LOAD_SPOTS = 'spots/LOAD_SPOTS';
const LOAD_SINGLE_SPOT = 'spots/LOAD_SINGLE_SPOT';
const ADD_SPOT = 'spots/ADD_SPOT';
const ADD_IMAGE = 'spots/ADD_IMAGE';
const ADD_REVIEW = 'spots/ADD_REVIEW';

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

// Add a new spot
const addSpot = (spot) => ({
    type: ADD_SPOT,
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
    const images = images.map(async (image) => {
      const response = await csrfFetch(`/api/spots/${spotId}/images`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(image),
      });
  
      if (response.ok) {
        const newImage = await response.json();
        dispatch(addImage(newImage));
        return newImage;
      } else {
        const errors = await response.json();
        console.error('Failed to add image:', image.url);
        return { errors };
      }
    });
    return images;
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
        // return spotsState
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

      case ADD_SPOT: {
        return {
            ...state,
            allSpots: {
                ...state.allSpots,
                [action.spot.id]: action.spot
            }
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