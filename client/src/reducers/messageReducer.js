import {
  GET_DIALOGS_PREVIEW,
  GET_DIALOG,
  CLOSE_DIALOG,
  GET_DIALOG_TARGET,
  SEND_MESSAGE,
  CLEAR_MESSAGE,
  ADD_NEW_MESSAGE,
  MESSAGES_READ,
  SET_UNREADED_COUNT
} from "../actions/types";

const initialState = {
  previews: [],
  targets: [],
  dialog: [],
  dialogTarget: null,
  message: null,
  unreaded_count: 0
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_DIALOGS_PREVIEW: {
      return {
        ...state,
        previews: action.payload.messages.slice().reverse(),
        targets: [...state.targets, ...action.payload.users]
      };
    }
    case GET_DIALOG:
      return {
        ...state,
        dialog: action.payload.messages,
        dialogTarget: parseInt(action.payload.user)
      };
    case CLOSE_DIALOG:
      return {
        ...state,
        dialog: [],
        dialogTarget: null
      };
    case SEND_MESSAGE:
      return {
        ...state,
        message: action.payload
      };
    case CLEAR_MESSAGE:
      return {
        ...state,
        message: null
      };
    case ADD_NEW_MESSAGE:
      return {
        ...state,
        previews: action.payload.previews,
        dialog: action.payload.dialog
      };
    case MESSAGES_READ:
      return {
        ...state,
        previews: action.payload.previews,
        dialog: action.payload.dialog
      };
    case GET_DIALOG_TARGET:
      return {
        ...state,
        targets: [...state.targets, action.payload.user]
      };
    case SET_UNREADED_COUNT:
      return {
        ...state,
        unreaded_count: action.payload.unreaded
      };
    default:
      return state;
  }
}
