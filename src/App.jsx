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
import { clearNotificationsState } from "./redux/notificationsReducer"

// Format 1.0
import GovernanceSchemasV1 from "./UI/Formats/Format1/Schemas1"
import GovernanceSchemaV1 from "./UI/Formats/Format1/Schema1"
import GovernanceParticipantsV1 from "./UI/Formats/Format1/Participants1"
import GovernanceParticipantV1 from "./UI/Formats/Format1/Participant1"
// Format 2.0
import GovernanceSchemasV2 from "./UI/Formats/Format2/Schemas2"
import GovernanceSchemaV2 from "./UI/Formats/Format2/Schema2"
import GovernanceParticipantsV2 from "./UI/Formats/Format2/Participants2"
import GovernanceParticipantV2 from "./UI/Formats/Format2/Participant2"

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

  // // Enable navigation prompt
  const myEvent = window.attachEvent || window.addEventListener
  const chkevent = window.attachEvent ? "onbeforeunload" : "beforeunload" /// make IE7, IE8 compitable

  myEvent(chkevent, function (e) {
    // For >=IE7, Chrome, Firefox
    const confirmationMessage = "Are you sure to leave the page?" // This custom message won't be displayed.
    ;(e || window.event).returnValue = confirmationMessage
    return confirmationMessage
  })

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
            path={`/governance/participants`}
            exact
            render={({ match, history }) => {
              return (
                <Frame id="app-frame">
                  <AppHeader match={match} history={history} />
                  <Main>
                    <GovernanceParticipantsV1 history={history} />
                  </Main>
                </Frame>
              )
            }}
          />
          <Route
            path={`/governance/participants/:participantId`}
            render={({ match, history }) => {
              return (
                <Frame id="app-frame">
                  <AppHeader match={match} history={history} />
                  <Main>
                    <GovernanceParticipantV1
                      history={history}
                      participantId={match.params.participantId}
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
            path={`/governance/participants`}
            exact
            render={({ match, history }) => {
              return (
                <Frame id="app-frame">
                  <AppHeader match={match} history={history} />
                  <Main>
                    <GovernanceParticipantsV2 history={history} />
                  </Main>
                </Frame>
              )
            }}
          />
          <Route
            path={`/governance/participants/:participantId`}
            render={({ match, history }) => {
              return (
                <Frame id="app-frame">
                  <AppHeader match={match} history={history} />
                  <Main>
                    <GovernanceParticipantV2
                      history={history}
                      participantId={match.params.participantId}
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
