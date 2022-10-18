import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import AppHeader from "./UI/AppHeader";
import styled from "styled-components";

import Governance from "./UI/Governance";

import "./App.css";

const Frame = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
`;
const Main = styled.main`
  flex: 9;
  padding: 30px;
`;

function App() {
  console.log("App rendered");
  return (
    <Router>
      <Switch>
        <Route
          path="/governance"
          exact
          render={({ match, history }) => {
            return (
              <Frame id="app-frame">
                <AppHeader match={match} history={history} />
                <Main>
                  <Governance />
                </Main>
              </Frame>
            );
          }}
        />
        {/* Redirect to root if no route match is found */}
        <Route render={() => <Redirect to="/governance" />} />
      </Switch>
    </Router>
  );
}

export default App;
