import {
  GET_All_USERS,
  GET_MORE_USERS,
  USERS_LOADING,
  GET_USER_BY_ID
} from "./../actions/types";

const initialState = {
  users: [],
  loadingList: false,
  no_more: false,
  next_page: null,
  user: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_All_USERS:
      return {
        ...state,
        users: action.payload.users,
        next_page: action.payload.next_page,
        loadingList: true
      };
    case USERS_LOADING:
      return {
        ...state,
        loadingList: action.payload
      };
    case GET_MORE_USERS:
      return {
        ...state,
        users: [...state.users, ...action.payload.users],
        next_page: action.payload.next_page,
        no_more: action.payload.no_more,
        loadingList: true
      };
    case GET_USER_BY_ID:
      return {
        ...state,
        user: action.payload.user
      };
    default:
      return state;
  }
}
