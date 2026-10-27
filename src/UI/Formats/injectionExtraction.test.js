import store from "../../store"
import {
  clearGovernanceState,
  setSelectedGovernance,
  setGovernanceMetadata,
} from "../../redux/governanceReducer"
import {
  handleMetadataInjection1_0,
  handleRolesInjection1_0,
  handleSchemasInjection1_0,
  handleParticipantsInjection1_0,
  handleParticipantsMetadataInjection1_0,
} from "./Format1/DataInjection1"
import { handleParticipantsInjection2_0 } from "./Format2/DataInjection2"
import {
  handleMetadataExtraction1_0,
  handleSchemasExtraction1_0,
  handleParticipantsExtraction1_0,
  handleRolesExtraction1_0,
} from "./Format1/DataExtraction1"

import format1 from "../../__fixtures__/format1.json"
import format2 from "../../__fixtures__/format2.json"

const clone = (o) => JSON.parse(JSON.stringify(o))
const ROLES_URI = "https://example.com/roles.schema.json"
const DESC_URI = "https://example.com/description.schema.json"

// Mirrors Governance.js upload flow. Injection mutates the schemas it is
// given, so always hand it a copy.
function load(fixture, participantsInjection) {
  const file = clone(fixture)
  const dispatch = store.dispatch
  store.dispatch(setSelectedGovernance(file))
  handleMetadataInjection1_0(file, dispatch)
  handleRolesInjection1_0(file, dispatch)
  handleSchemasInjection1_0(file, dispatch)
  participantsInjection(file, dispatch)
  handleParticipantsMetadataInjection1_0(file, dispatch)
  return file
}

beforeEach(() => {
  store.dispatch(clearGovernanceState())
  vi.spyOn(console, "log").mockImplementation(() => {})
})
afterEach(() => {
  console.log.mockRestore()
})

describe("data injection", () => {
  test("metadata: copies the descriptive fields and @context", () => {
    load(format1, handleParticipantsInjection1_0)
    expect(store.getState().governance.metadata).toEqual({
      "@context": format1["@context"],
      author: format1.author,
      description: format1.description,
      docs_uri: format1.docs_uri,
      format: "1.0",
      id: format1.id,
      last_updated: format1.last_updated,
      name: format1.name,
      version: format1.version,
    })
  })

  test("roles: flattens into action/subject records with sequential ids", () => {
    load(format2, handleParticipantsInjection2_0)
    const { roles } = store.getState().governance
    expect(roles).toHaveLength(4)
    expect(roles[0]).toEqual({
      role_id: 1,
      governance_id: format2.id,
      role: "role_1",
      action: "issue",
      subject: ["QHqtjywxfP3yYsFrRHFLQm:2:Employment:1.0"],
    })
    expect(roles[2]).toMatchObject({ role: "role_3", action: "verify", role_id: 3 })
  })

  test("schemas: tags each with schema_id and governance_id", () => {
    load(format2, handleParticipantsInjection2_0)
    const { schemas } = store.getState().governance
    expect(schemas.map((s) => s.schema_id)).toEqual([1, 2])
    schemas.forEach((s) => expect(s.governance_id).toBe(format2.id))
  })

  test("participants 1.0: keeps the four basic fields and roles", () => {
    load(format1, handleParticipantsInjection1_0)
    const { participants } = store.getState().governance
    expect(participants).toHaveLength(2)
    expect(participants[0]).toEqual({
      participant_id: 1,
      did: "98nVuCngj7ReESPrH7skpF",
      governance_id: format1.id,
      email: "credential_manager@issuinggovernmentsite.org",
      name: "Proven issuer agency",
      phone: "123-456-6780",
      website: "issuinggovernmentsite.org",
      roles: ["role_1", "role_2"],
    })
  })

  test("participants 2.0: adds address, city, zip and state", () => {
    load(format2, handleParticipantsInjection2_0)
    const { participants } = store.getState().governance
    expect(participants[1]).toMatchObject({
      participant_id: 2,
      did: "WdvgJP7fwfvCrKupRRhDEu",
      address: "824 State St.",
      city: "Christiansburg",
      zip: "24073",
      state: "VA",
      roles: ["role_3", "role_4"],
    })
  })

  test("participants metadata is captured", () => {
    load(format2, handleParticipantsInjection2_0)
    expect(store.getState().governance.participantsMetadata).toEqual({
      author: format2.participants.author,
      id: format2.participants.id,
      created: format2.participants.created,
      topic: format2.participants.topic,
      version: format2.participants.version,
    })
  })
})

describe("round trip (inject then extract)", () => {
  test("format 2.0 schemas, participants and roles come back unchanged", () => {
    load(format2, handleParticipantsInjection2_0)
    expect(handleSchemasExtraction1_0()).toEqual(format2.schemas)
    expect(handleParticipantsExtraction1_0()).toEqual(format2.participants.entries)
    expect(Object.assign({}, ...handleRolesExtraction1_0())).toEqual(format2.roles)
  })

  test("format 1.0 schemas, participants and roles come back unchanged", () => {
    load(format1, handleParticipantsInjection1_0)
    expect(handleSchemasExtraction1_0()).toEqual(format1.schemas)
    expect(handleParticipantsExtraction1_0()).toEqual(format1.participants.entries)
    expect(Object.assign({}, ...handleRolesExtraction1_0())).toEqual(format1.roles)
  })

  test("extraction does not mutate store state", () => {
    load(format2, handleParticipantsInjection2_0)
    const before = JSON.stringify(store.getState().governance)
    handleSchemasExtraction1_0()
    handleParticipantsExtraction1_0()
    handleRolesExtraction1_0()
    expect(JSON.stringify(store.getState().governance)).toBe(before)
  })

  test("metadata extraction refreshes last_updated and syncs the store", () => {
    load(format2, handleParticipantsInjection2_0)
    const result = handleMetadataExtraction1_0(store.dispatch)
    expect(result.last_updated).toBeGreaterThan(format2.last_updated)
    expect(store.getState().governance.metadata).toEqual(result)
    expect(result.name).toBe(format2.name)
  })

  test("downgrading to 1.0 strips 2.0-only fields", () => {
    load(format2, handleParticipantsInjection2_0)
    const { metadata } = store.getState().governance
    store.dispatch(setGovernanceMetadata({ ...metadata, format: "1.0" }))
    const entries = handleParticipantsExtraction1_0()[DESC_URI]
    Object.values(entries).forEach((p) => {
      ["address", "city", "zip", "state"].forEach((k) => expect(p).not.toHaveProperty(k))
    })
    handleSchemasExtraction1_0().forEach((s) => expect(s).not.toHaveProperty("creator"))
  })

  test("upgrading to 2.0 fills placeholders for missing fields", () => {
    load(format1, handleParticipantsInjection1_0)
    const { metadata } = store.getState().governance
    store.dispatch(setGovernanceMetadata({ ...metadata, format: "2.0" }))
    Object.values(handleParticipantsExtraction1_0()[DESC_URI]).forEach((p) =>
      expect(p).toMatchObject({ address: "", city: "", zip: "", state: "" })
    )
    handleSchemasExtraction1_0().forEach((s) => expect(s.creator).toBe(""))
  })

  test("only records for the selected governance are extracted", () => {
    load(format2, handleParticipantsInjection2_0)
    store.dispatch(setSelectedGovernance({ id: "some-other-governance" }))
    expect(handleSchemasExtraction1_0()).toEqual([])
    expect(handleParticipantsExtraction1_0()).toEqual({ [ROLES_URI]: {}, [DESC_URI]: {} })
    expect(handleRolesExtraction1_0()).toEqual([])
  })
})
