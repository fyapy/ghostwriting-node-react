import axios from "axios";

import {
  GET_All_USERS,
  GET_MORE_USERS,
  USERS_LOADING,
  GET_USER_BY_ID
} from "./types";

// Users - Get users
export const getAllUsers = () => dispatch => {
  axios.get("/api/users").then(res => {
    // Return users
    dispatch({
      type: GET_All_USERS,
      payload: res.data
    });
  });
};

// Users - Get more users
export const getMoreUsers = page => dispatch => {
  dispatch({
    type: USERS_LOADING,
    payload: false
  });
  axios.get(`/api/users?p=${page}`).then(res => {
    // Return posts
    dispatch({
      type: GET_MORE_USERS,
      payload: res.data
    });
  });
};

// Get user by id
export const getUserById = id => dispatch => {
  axios
    .get(`/api/users/${id}`)
    .then(res => {
      dispatch({
        type: GET_USER_BY_ID,
        payload: res.data
      });
    })
    .catch(err => console.log(`User not found`));
};
