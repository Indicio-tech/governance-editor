import React from "react";
// import { useSelector } from "react-redux";
import { ThemeProvider } from "styled-components";

import App from "../App";
import { NotificationProvider } from "./NotificationProvider";

function AppContainer() {
  const theme = {
    primary_color: "#333545",
    secondary_color: "#FF6701",
    tertiary_color: "#FAD744",
    neutral_color: "#808080",
    negative_color: "#e33636",
    warning_color: "#ff8c42",
    positive_color: "#4CB944",
    text_color: "#555",
    text_light: "#fff",
    border: "#e3e3e3",
    drop_shadow: "3px 3px 3px rgba(0, 0, 0, 0.3)",
    background_primary: "#fff",
    background_secondary: "#f5f5f5",
  };

  return (
    <ThemeProvider theme={theme}>
      <NotificationProvider>
        <App />
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default AppContainer;
