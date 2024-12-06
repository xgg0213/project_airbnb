// Action type
const LOAD_REVIEWS = 'review/LOAD_REVIEWS';

// load all reviews for a spot
export const loadReviews = (reviews) => ({
  type: LOAD_REVIEWS,
  reviews,
});

export const fetchSpotReviews = (spotId) => async (dispatch) => {
  const response = await fetch(`/api/spots/${spotId}/reviews`);
  if (response.ok) {
    const reviews = await response.json();
    dispatch(loadReviews(reviews.Reviews));
  }
};

const initialState = {
  spotReviews: {},
};

const reviewReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_REVIEWS: {
        const reviewState = {};
        action.reviews.map(review => reviewState[review.id]=review)
        return {
            ...state,
            spotReviews: reviewState,
            };
    }
      
    default:
        return state;
  }
};

export default reviewReducer;
