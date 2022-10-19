import React from "react";
// import ReactDOM from "react-dom/client";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

// import * as serviceWorker from "./serviceWorker";

// import "./index.css";
// import reportWebVitals from "./reportWebVitals";

import AppContainer from "./UI/AppContainer";
import store from "./store";

// const root = ReactDOM.createRoot(document.getElementById("root"));

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <AppContainer />
    </React.StrictMode>
  </Provider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
// serviceWorker.unregister();
