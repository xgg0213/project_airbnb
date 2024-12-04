// Action types
const LOAD_SPOTS = 'spots/LOAD_SPOTS';
const LOAD_SINGLE_SPOT = 'spots/LOAD_SINGLE_SPOT';

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

// Thunks
export const fetchAllSpots = () => async (dispatch) => {
    const response = await fetch('/api/spots');
    
    if (response.ok) {
      const spots = await response.json();
      const spots_new = spots.Spots;
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
      const spot_new = spot[0];
      dispatch(loadSingleSpot(spot_new));
    } else {
      console.error('Failed to fetch spot details');
    }
};

// initial state
const initialState = {};

// Reducer
const spotReducer = (state = initialState, action) => {
    switch (action.type) {
      case LOAD_SPOTS: {
        const spotsState = {};
        // const spots_obj = action.spots;
        // spots_obj.Spots.forEach((spot) => {
        //     spotsState[spot.id] = spot;
        //   });
        action.spots.forEach((spot) => {
            spotsState[spot.id] = spot;
        });
        return spotsState;
      }
        
      case LOAD_SINGLE_SPOT: {
        return {
            ...state,
            [action.spot.id]: action.spot, 
          };
      }
        
      default:
        return state;
    }
  };
  
export default spotReducer;