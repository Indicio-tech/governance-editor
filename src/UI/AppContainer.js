import React from "react";
// import { useSelector } from "react-redux";
// import { ThemeProvider } from "styled-components";

import App from "../App";
import { NotificationProvider } from "./NotificationProvider";

function AppContainer() {
  // const themeState = useSelector((state) => state.settings.theme);

  return (
    // <ThemeProvider theme={themeState}>
    <NotificationProvider>
      <App />
    </NotificationProvider>
    // </ThemeProvider>
  );
}

export default AppContainer;
