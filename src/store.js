import { createStore, combineReducers } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";

import governanceReducer from "./redux/governanceReducer";
import notificationsReducer from "./redux/notificationsReducer";

const rootReducer = combineReducers({
  governance: governanceReducer,
  notifications: notificationsReducer,
});

export default createStore(rootReducer, composeWithDevTools());
