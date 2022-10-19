import React from "react"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom"
import AppHeader from "./UI/AppHeader"
import styled from "styled-components"

import Governance from "./UI/Governance"
import GovernanceMetadata from "./UI/GovernanceMetadata"
import GovernanceSchemas from "./UI/GovernanceSchemas"
import GovernanceSchema from "./UI/GovernanceSchema"
import GovernanceIssuers from "./UI/GovernanceIssuers"
import GovernanceIssuer from "./UI/GovernanceIssuer"

import "./App.css"

const Frame = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
`
const Main = styled.main`
  flex: 9;
  padding: 30px;
`

function App() {
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
            )
          }}
        />

        <Route
          path={`/governance/metadata`}
          render={({ match, history }) => {
            return (
              <Frame id="app-frame">
                <AppHeader match={match} history={history} />
                <Main>
                  <GovernanceMetadata history={history} />
                </Main>
              </Frame>
            )
          }}
        />
        <Route
          path={`/governance/schemas`}
          exact
          render={({ match, history }) => {
            return (
              <Frame id="app-frame">
                <AppHeader match={match} history={history} />
                <Main>
                  <GovernanceSchemas history={history} />
                </Main>
              </Frame>
            )
          }}
        />
        <Route
          path={`/governance/schemas/:id`}
          render={({ match, history }) => {
            return (
              <Frame id="app-frame">
                <AppHeader match={match} history={history} />
                <Main>
                  <GovernanceSchema history={history} id={match.params.id} />
                </Main>
              </Frame>
            )
          }}
        />
        <Route
          path={`/governance/issuers`}
          exact
          render={({ match, history }) => {
            return (
              <Frame id="app-frame">
                <AppHeader match={match} history={history} />
                <Main>
                  <GovernanceIssuers history={history} />
                </Main>
              </Frame>
            )
          }}
        />
        <Route
          path={`/governance/issuers/:issuerId`}
          render={({ match, history }) => {
            return (
              <Frame id="app-frame">
                <AppHeader match={match} history={history} />
                <Main>
                  <GovernanceIssuer
                    history={history}
                    issuerId={match.params.issuerId}
                  />
                </Main>
              </Frame>
            )
          }}
        />

        {/* Redirect to root if no route match is found */}
        <Route render={() => <Redirect to="/governance" />} />
      </Switch>
    </Router>
  )
}

export default App
