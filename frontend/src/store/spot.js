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
        
      default:
        return state;
    }
  };
  
export default spotReducer;