import { GET_ALL_DEALS } from "../actions/types";

const initialState = {
  deals: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_ALL_DEALS:
      return {
        ...state,
        deals: action.payload.deals
      };
    default:
      return state;
  }
}
