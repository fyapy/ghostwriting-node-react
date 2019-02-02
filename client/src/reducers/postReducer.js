import {
  GET_All_POSTS,
  GET_MORE_POSTS,
  GET_POST_BY_ID,
  POSTS_LOADING,
  GET_MY_POSTS,
  SET_MY_DEAL_POST
} from "../actions/types";

const initialState = {
  post: null,
  posts: [],
  my_posts: null,
  my_deal_post: null,
  loading_posts: false,
  next_page: null,
  no_more: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_All_POSTS:
      return {
        ...state,
        posts: action.payload.posts,
        next_page: action.payload.next_page,
        no_more: action.payload.no_more,
        loading_posts: true
      };
    case GET_MORE_POSTS:
      return {
        ...state,
        posts: state.posts.concat(action.payload.posts),
        next_page: action.payload.next_page,
        no_more: action.payload.no_more,
        loading_posts: true
      };
    case POSTS_LOADING:
      return {
        ...state,
        loading_posts: action.payload
      };
    case GET_POST_BY_ID:
      return {
        ...state,
        post: action.payload.post
      };
    case GET_MY_POSTS:
      return {
        ...state,
        my_posts: action.payload.posts
      };
    case SET_MY_DEAL_POST:
      return {
        ...state,
        my_deal_post: action.payload
      };
    default:
      return state;
  }
}
