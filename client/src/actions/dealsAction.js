import axios from "axios";

import { GET_ALL_DEALS } from "./types";

// Get deals
export const getAllDeals = () => dispatch => {
  axios
    .get("/api/deals")
    .then(deals => {
      dispatch({
        type: GET_ALL_DEALS,
        payload: deals.data
      });
    })
    .catch(err => console.log(err.response.data));
};

// Deals - Set deal success
export const successDeal = (data, callback) => dispatch => {
  axios
    .post("/api/deals/success", data)
    .then(res => {
      // Redirect to deals
      callback();
    })
    .catch(err => console.log(err.response.data));
};
