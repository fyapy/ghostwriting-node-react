import axios from "axios";

import {
  GET_PROFILE,
  PROFILE_LOADING,
  UPLOAD_AVATAR,
  CHANGE_DESCRIPTION,
  GET_PAYMENTS_HISTORY,
  SET_BALANCE
} from "./types";

// Get current profile
export const getCurrentProfile = () => dispatch => {
  dispatch(setProfileLoading());
  axios
    .get("/api/users/current")
    .then(res =>
      dispatch({
        type: GET_PROFILE,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_PROFILE,
        payload: {}
      })
    );
};

// Profile loading
export const setProfileLoading = () => {
  return {
    type: PROFILE_LOADING
  };
};

// Profile upload avatar
export const uploadAvatar = avatarData => dispatch => {
  axios
    .post("/api/profile/avatar", avatarData)
    .then(res => {
      dispatch({
        type: UPLOAD_AVATAR,
        payload: res.data
      });
    })
    .catch(err => console.log(err.response.data));
};

// Profile change description
export const changeDescription = description => dispatch => {
  axios
    .post("/api/profile/description", description)
    .then(res => {
      dispatch({
        type: CHANGE_DESCRIPTION
      });
    })
    .catch(err => console.log(err.response.data));
};

// Get user payments history
export const getPaymentsHistory = () => dispatch => {
  axios
    .get("/api/profile/balance")
    .then(res => {
      dispatch({
        type: GET_PAYMENTS_HISTORY,
        payload: res.data
      });
    })
    .catch(err => console.log(err.response.data));
};

// Get user payments history
export const cashOutBalance = data => dispatch => {
  axios
    .post("/api/profile/cashout", data)
    .then(res => {
      dispatch({
        type: SET_BALANCE,
        payload: res.data
      });
    })
    .catch(err => console.log(err.response.data));
};
