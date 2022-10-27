import React, { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom"
import AppHeader from "./UI/Core/AppHeader"
import styled from "styled-components"

// Core
import Governance from "./UI/Core/Governance"
import { useNotification } from "./UI/Core/NotificationProvider"
import {
  clearNotificationsState,
  // setNotificationState,
} from "./redux/notificationsReducer"

// Format 1.0
import GovernanceSchemasV1 from "./UI/Versions/Version1/GovernanceSchemasV1"
import GovernanceSchemaV1 from "./UI/Versions/Version1/GovernanceSchemaV1"
import GovernanceIssuersV1 from "./UI/Versions/Version1/GovernanceIssuersV1"
import GovernanceIssuerV1 from "./UI/Versions/Version1/GovernanceIssuerV1"
// Format 2.0
import GovernanceSchemasV2 from "./UI/Versions/Version2/GovernanceSchemasV2"
import GovernanceSchemaV2 from "./UI/Versions/Version2/GovernanceSchemaV2"
import GovernanceIssuersV2 from "./UI/Versions/Version2/GovernanceIssuersV2"
import GovernanceIssuerV2 from "./UI/Versions/Version2/GovernanceIssuerV2"

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
  const dispatch = useDispatch()
  const governanceState = useSelector((state) => state.governance)
  const notificationsState = useSelector((state) => state.notifications)
  const { notificationType, notificationMessage } = notificationsState

  const setNotification = useNotification()

  useEffect(() => {
    if ((notificationMessage, notificationType)) {
      setNotification(notificationMessage, notificationType)
      dispatch(clearNotificationsState())
    }
  }, [notificationMessage, notificationType, setNotification, dispatch])

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
                    <GovernanceSchemasV1 history={history} />
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
                    <GovernanceSchemaV1
                      history={history}
                      id={match.params.id}
                    />
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
                    <GovernanceIssuersV1 history={history} />
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
                    <GovernanceIssuerV1
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
  // (eldersonar) Render the highest format of the governance file by default (2.0)
  else {
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
                    <GovernanceSchemaV2
                      history={history}
                      id={match.params.id}
                    />
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
                    <GovernanceIssuersV2 history={history} />
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
                    <GovernanceIssuerV2
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
