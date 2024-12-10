import { csrfFetch } from "./csrf";

// Action type
const LOAD_REVIEWS = 'review/LOAD_REVIEWS';
const ADD_REVIEW = 'review/ADD_REVIEW';
const DELETE_REVIEW = 'review/DELETE_REVIEW';

// load all reviews for a spot
export const loadReviews = (reviews) => ({
  type: LOAD_REVIEWS,
  reviews,
});

// add a review
export const addReview = (review) => ({
  type: ADD_REVIEW,
  review,
});

// delete a review
export const deleteReviewAction = (reviewId) => ({
  type: DELETE_REVIEW,
  reviewId,
});

export const fetchSpotReviews = (spotId) => async (dispatch) => {
  const response = await fetch(`/api/spots/${spotId}/reviews`);
  if (response.ok) {
    const reviews = await response.json();
    dispatch(loadReviews(reviews.Reviews));
  }
};

export const createReview = (spotId, reviewData) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reviewData),
  });

  if (response.ok) {
    const newReview = await response.json();
    dispatch(addReview(newReview)); // Dispatch action to add the new review
    return newReview;
  } else {
    const error = await response.json();
    return { errors: error.errors || ['An unexpected error occurred.'] };
  }
};

export const deleteReview = (reviewId) => async (dispatch) => {
  const response = await csrfFetch(`/api/reviews/${reviewId}`, { method: 'DELETE' });
  if (response.ok) {
    dispatch(deleteReviewAction(reviewId));
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
    
    case ADD_REVIEW: {
      return {
        ...state,
        spotReviews: {
          ...state.spotReviews,
          [action.review.id]: action.review, // Add the new review
        },
      };
    }

    case DELETE_REVIEW: {
      const reviewState = { ...state };
      delete reviewState.spotReviews[action.reviewId];
      return reviewState;
    }
    
    default:
        return state;
  }
};

export default reviewReducer;
