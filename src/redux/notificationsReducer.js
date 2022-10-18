/* eslint-disable import/no-anonymous-default-export */

const initialState = {
  notificationMessage: "",
  notificationType: "",
};

const SET_NOTIFICATION_STATE = "SET_NOTIFICATION_STATE";
const CLEAR_NOTIFICATIONS_STATE = "CLEAR_NOTIFICATIONS_STATE";

export function setNotificationState(message) {
  return {
    type: SET_NOTIFICATION_STATE,
    payload: message,
  };
}
export function clearNotificationsState() {
  return {
    type: CLEAR_NOTIFICATIONS_STATE,
    payload: null,
  };
}

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_NOTIFICATION_STATE:
      return {
        notificationMessage: action.payload.message,
        notificationType: action.payload.type,
      };

    case CLEAR_NOTIFICATIONS_STATE:
      return initialState;

    default:
      return state;
  }
}
