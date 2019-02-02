import axios from "axios";

import {
  GET_All_POSTS,
  GET_MORE_POSTS,
  GET_POST_BY_ID,
  POSTS_LOADING,
  GET_ERRORS,
  GET_MY_POSTS,
  SET_MY_DEAL_POST
} from "./types";

// Posts - Get posts
export const getAllPosts = () => dispatch => {
  axios.get("/api/posts").then(res => {
    // Return posts
    dispatch({
      type: GET_All_POSTS,
      payload: res.data
    });
  });
};

// Posts - Get more posts
export const getMorePosts = page => dispatch => {
  dispatch({
    type: POSTS_LOADING,
    payload: false
  });
  axios.get(`/api/posts?p=${page}`).then(res => {
    // Return posts
    dispatch({
      type: GET_MORE_POSTS,
      payload: res.data
    });
  });
};

export const getPostById = id => dispatch => {
  axios
    .get(`/api/posts/${id}`)
    .then(res => {
      dispatch({
        type: GET_POST_BY_ID,
        payload: res.data
      });
    })
    .catch(err => console.log(`Post not found`));
};

// Create post
export const createPost = (postData, history) => dispatch => {
  console.log(`Creating post`);

  axios
    .post("/api/posts", postData)
    .then(res => history.push("/posts"))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Posts - Get my posts
export const getMyPosts = () => dispatch => {
  axios.get("/api/posts/my").then(res => {
    // Return posts
    dispatch({
      type: GET_MY_POSTS,
      payload: res.data
    });
  });
};

// Posts - Set my deal posts
export const setMyDealPost = id => dispatch => {
  dispatch({
    type: SET_MY_DEAL_POST,
    payload: id
  });
};

// Posts - Set executor for post
export const setExecutor = (data, history) => dispatch => {
  console.log(data);
  axios
    .post("/api/posts/executor", data)
    .then(res => {
      // Redirect to deals
      history.push("/deals");
      dispatch({
        type: SET_MY_DEAL_POST,
        payload: null
      });
    })
    .catch(err => console.log(err.response.data));
};
