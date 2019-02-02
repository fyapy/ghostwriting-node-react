import axios from "axios";
import uuid from "uuid";
import isEmpty from "../validation/is-empty";

import {
  GET_DIALOGS_PREVIEW,
  GET_DIALOG,
  CLOSE_DIALOG,
  SEND_MESSAGE,
  CLEAR_MESSAGE,
  ADD_NEW_MESSAGE,
  MESSAGES_READ,
  GET_DIALOG_TARGET,
  SET_UNREADED_COUNT
} from "./types";

// Messages - Get dialogs preview
export const getDialogsPreview = () => dispatch => {
  axios.get("/api/profile/dialogs").then(res => {
    // Return posts
    dispatch({
      type: GET_DIALOGS_PREVIEW,
      payload: res.data
    });
  });
};

// Messages - Get user dialog with someone
export const getDialog = id => dispatch => {
  axios.get(`/api/profile/dialog/${id}`).then(res => {
    // Return dialog
    dispatch({
      type: GET_DIALOG,
      payload: res.data
    });
  });
};

// Messages - Close user dialog
export const closeDialog = () => dispatch => {
  dispatch({
    type: CLOSE_DIALOG
  });
};

// Send message
export const sendMessage = (message, to, post) => dispatch => {
  dispatch({
    type: SEND_MESSAGE,
    payload: { message, to, post }
  });
};

// Send message
export const clearMessage = () => dispatch => {
  dispatch({
    type: CLEAR_MESSAGE
  });
};

// Add sended message
export const addSendedMessage = (
  data,
  previews,
  recipientId,
  dialog
) => dispatch => {
  // Find index in previews
  let index = previews.findIndex(obj => {
    return obj.fromId === data.from
      ? true
      : obj.toId === data.from
      ? true
      : false;
  });

  let newPreview;
  // Edit preview by index
  if (!isEmpty(index) && index !== -1) {
    Object.assign(previews[index], {
      text: data.text,
      fromId: data.from,
      toId: data.to,
      readed: null
    });
    // Create new preview
    newPreview = previews[index];
    // Delete current preview
    previews.splice(index, 1);
  } else {
    newPreview = {
      id: uuid.v4(),
      postId: null,
      parentId: null,
      readed: null,
      createdAt: "2018-12-02T17:26:14.000Z",
      updatedAt: "2018-12-06T17:30:04.000Z"
    };
    Object.assign(newPreview, {
      text: data.text,
      fromId: data.from,
      toId: data.to,
      readed: null
    });
  }
  // Add new preview to array start
  previews.unshift(newPreview);

  // Check if it is currnet dialog
  if (recipientId === data.to) {
    dialog.push({
      id: data.id,
      text: data.text,
      fromId: data.from,
      toId: data.to,
      postId: null,
      readed: null,
      createdAt: new Date()
    });
  }

  dispatch({
    type: ADD_NEW_MESSAGE,
    payload: {
      previews,
      dialog
    }
  });
};

// Add new message
export const addNewMessage = (
  data,
  previews,
  recipientId,
  dialog
) => dispatch => {
  // Find index in previews
  let index = previews.findIndex(obj => {
    return obj.fromId === data.from
      ? true
      : obj.toId === data.from
      ? true
      : false;
  });

  let newPreview;
  // Edit preview by index
  if (!isEmpty(index) && index !== -1) {
    Object.assign(previews[index], {
      text: data.text,
      fromId: data.from,
      toId: data.to,
      readed: null
    });
    // Create new preview
    newPreview = previews[index];
    // Delete current preview
    previews.splice(index, 1);
  } else {
    newPreview = {
      id: uuid.v4(),
      postId: null,
      parentId: null,
      readed: null,
      createdAt: "2018-12-02T17:26:14.000Z",
      updatedAt: "2018-12-06T17:30:04.000Z"
    };
    Object.assign(newPreview, {
      text: data.text,
      fromId: data.from,
      toId: data.to,
      readed: null
    });
  }
  // Add new preview to array start
  previews.unshift(newPreview);

  // Check if it is currnet dialog
  if (recipientId === data.from) {
    dialog.push({
      id: uuid.v4(),
      text: data.text,
      fromId: data.from,
      toId: data.to,
      postId: null,
      readed: null,
      createdAt: new Date()
    });
  }

  dispatch({
    type: ADD_NEW_MESSAGE,
    payload: {
      previews,
      dialog
    }
  });
};

// Send message
export const readMessages = (
  from,
  previews,
  recipientId,
  dialog
) => dispatch => {
  let index = previews.findIndex(obj => {
    return obj.fromId === from ? true : obj.toId === from ? true : false;
  });

  if (!isEmpty(index) && index !== -1) {
    Object.assign(previews[index], {
      readed: 1
    });
  }

  if (recipientId === from) {
    dialog.forEach(el => {
      el.readed = 1;
    });
  }

  dispatch({
    type: MESSAGES_READ,
    payload: {
      previews,
      dialog
    }
  });
};

// Messages - Get dialog target
export const getTarget = id => dispatch => {
  axios.get(`/api/users/${id}`).then(res => {
    // Return dialog
    dispatch({
      type: GET_DIALOG_TARGET,
      payload: res.data
    });
  });
};

// Messages - Get dialog target
export const setUnreaded = data => dispatch => {
  dispatch({
    type: SET_UNREADED_COUNT,
    payload: data
  });
};
