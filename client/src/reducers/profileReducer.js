import {
  GET_PROFILE,
  PROFILE_LOADING,
  CHANGE_DESCRIPTION,
  UPLOAD_AVATAR,
  GET_PAYMENTS_HISTORY,
  SET_BALANCE
} from "./../actions/types";

const initialState = {
  profile: null,
  profiles: null,
  loading: false,
  updated: null,
  uploaded: null,
  payments_history: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case PROFILE_LOADING:
      return {
        ...state,
        loading: true
      };
    case GET_PROFILE:
      return {
        ...state,
        profile: action.payload,
        loading: false
      };
    case CHANGE_DESCRIPTION:
      return {
        ...state,
        updated: true
      };
    case UPLOAD_AVATAR:
      return {
        ...state,
        uploaded: true,
        profile: { ...state.profile, avatar: action.payload.avatar }
      };
    case GET_PAYMENTS_HISTORY:
      return {
        ...state,
        payments_history: action.payload.balance
      };
    case SET_BALANCE:
      return {
        ...state,
        profile: { ...state.profile, balance: action.payload.balance }
      };
    default:
      return state;
  }
}
