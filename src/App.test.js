import React from "react"
import { render, screen, cleanup } from "@testing-library/react"
import { Provider } from "react-redux"

import AppContainer from "./UI/AppContainer"
import store from "./store"
import {
  clearGovernanceState,
  setSelectedGovernance,
} from "./redux/governanceReducer"
import { clearNotificationsState } from "./redux/notificationsReducer"
import {
  handleMetadataInjection1_0,
  handleRolesInjection1_0,
  handleSchemasInjection1_0,
  handleParticipantsInjection1_0,
  handleParticipantsMetadataInjection1_0,
} from "./UI/Formats/Format1/DataInjection1"
import { handleParticipantsInjection2_0 } from "./UI/Formats/Format2/DataInjection2"

import format1 from "./__fixtures__/format1.json"
import format2 from "./__fixtures__/format2.json"

// Keeps the tests off the network (axios 1.x is ESM-only, which CRA 2's Jest can't load)
jest.mock("axios", () => ({ __esModule: true, default: jest.fn() }))

const clone = (o) => JSON.parse(JSON.stringify(o))

// Same sequence Governance.js runs after a file upload
function loadGovernance(fixture, injectParticipants) {
  const file = clone(fixture)
  const { dispatch } = store
  dispatch(setSelectedGovernance(file))
  handleMetadataInjection1_0(file, dispatch)
  handleRolesInjection1_0(file, dispatch)
  handleSchemasInjection1_0(file, dispatch)
  injectParticipants(file, dispatch)
  handleParticipantsMetadataInjection1_0(file, dispatch)
}

function renderAt(path) {
  window.history.pushState({}, "", path)
  return render(
    <Provider store={store}>
      <AppContainer />
    </Provider>
  )
}

let errorSpy
beforeEach(() => {
  store.dispatch(clearGovernanceState())
  store.dispatch(clearNotificationsState())
  jest.spyOn(console, "log").mockImplementation(() => {})
  errorSpy = jest.spyOn(console, "error")
})
afterEach(() => {
  cleanup()
  // A React render/prop-type error would be logged here; a smoke test should not tolerate it
  expect(errorSpy).not.toHaveBeenCalled()
  errorSpy.mockRestore()
  console.log.mockRestore()
})

describe("smoke: no governance file loaded", () => {
  test("renders the governance landing page", () => {
    renderAt("/governance")
    expect(screen.getByText("Ecosystem Governance")).toBeInTheDocument()
    expect(screen.getByText("Governance Metadata")).toBeInTheDocument()
    expect(screen.getByText("Download")).toBeInTheDocument()
  })

  test("unknown routes redirect to /governance", () => {
    renderAt("/does-not-exist")
    expect(window.location.pathname).toBe("/governance")
    expect(screen.getByText("Ecosystem Governance")).toBeInTheDocument()
  })

  test("renders the app navigation", () => {
    renderAt("/governance")
    expect(screen.getAllByRole("link").length).toBeGreaterThan(0)
  })
})

describe.each([
  ["1.0", format1, handleParticipantsInjection1_0],
  ["2.0", format2, handleParticipantsInjection2_0],
])("smoke: format %s governance loaded", (version, fixture, inject) => {
  beforeEach(() => loadGovernance(fixture, inject))

  test("landing page shows the metadata", () => {
    renderAt("/governance")
    expect(screen.getByText(fixture.name)).toBeInTheDocument()
    expect(screen.getByText(fixture.author)).toBeInTheDocument()
    expect(screen.getByText(version)).toBeInTheDocument()
  })

  test("schemas list shows every schema", () => {
    renderAt("/governance/schemas")
    fixture.schemas.forEach((s) =>
      expect(screen.getByText(s.name)).toBeInTheDocument()
    )
  })

  test("schema detail renders", () => {
    renderAt("/governance/schemas/1")
    expect(window.location.pathname).toBe("/governance/schemas/1")
    expect(screen.getByText("Email Credential")).toBeInTheDocument()
  })

  test("participants list shows every participant", () => {
    renderAt("/governance/participants")
    expect(screen.getByText("Proven issuer agency")).toBeInTheDocument()
    expect(screen.getByText("Proven verifier agency")).toBeInTheDocument()
  })

  test("participant detail renders", () => {
    renderAt("/governance/participants/1")
    expect(screen.getByText("Proven issuer agency")).toBeInTheDocument()
  })
})
