import React from "react"
import { useSelector } from "react-redux"

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom"
import AppHeader from "./UI/Core/AppHeader"
import styled from "styled-components"

import Governance from "./UI/Core/Governance"
import GovernanceSchemas from "./UI/Versions/Version1/GovernanceSchemasV1"

import GovernanceSchemasV2 from "./UI/Versions/Version2/GovernanceSchemasV2"

import GovernanceSchema from "./UI/Versions/Version1/GovernanceSchemaV1"
import GovernanceIssuers from "./UI/Versions/Version1/GovernanceIssuersV1"
import GovernanceIssuer from "./UI/Versions/Version1/GovernanceIssuerV1"

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
  // const dispatch = useDispatch()
  const governanceState = useSelector((state) => state.governance)

  if (governanceState.metadata.format === "1.0") {
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
  } else if (governanceState.metadata.format === "2.0") {
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
            path={`/governance/schemas`}
            exact
            render={({ match, history }) => {
              return (
                <Frame id="app-frame">
                  <AppHeader match={match} history={history} />
                  <Main>
                    <GovernanceSchemasV2 history={history} />
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
  } else {
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
}

export default App
