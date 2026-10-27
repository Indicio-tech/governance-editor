import reducer, {
  setSelectedGovernance,
  setGovernanceMetadata,
  setGovernanceSchemas,
  setSelectedGovernanceSchema,
  setSelectedGovernanceParticipant,
  setGovernanceParticipantsMetadata,
  setGovernanceParticipants,
  setGovernanceRoles,
  setGovernanceDID,
  setFileUploaded,
  clearGovernanceState,
} from "./governanceReducer"

const initial = reducer(undefined, { type: "@@INIT" })

describe("governanceReducer", () => {
  test("returns the initial state", () => {
    expect(initial).toEqual({
      selectedGovernance: {},
      metadata: {},
      selectedSchema: {},
      schemas: [],
      selectedParticipant: {},
      participants: [],
      participantsMetadata: {},
      roles: [],
      fileUploaded: false,
      did: null,
    })
  })

  test("ignores unknown actions", () => {
    expect(reducer(initial, { type: "UNKNOWN" })).toBe(initial)
  })

  test.each([
    ["setSelectedGovernance", setSelectedGovernance, "selectedGovernance", { id: "g1" }],
    ["setGovernanceMetadata", setGovernanceMetadata, "metadata", { format: "2.0" }],
    ["setGovernanceSchemas", setGovernanceSchemas, "schemas", [{ id: "s1" }]],
    ["setSelectedGovernanceSchema", setSelectedGovernanceSchema, "selectedSchema", { id: "s1" }],
    ["setSelectedGovernanceParticipant", setSelectedGovernanceParticipant, "selectedParticipant", { did: "d1" }],
    ["setGovernanceParticipantsMetadata", setGovernanceParticipantsMetadata, "participantsMetadata", { id: "p1" }],
    ["setGovernanceParticipants", setGovernanceParticipants, "participants", [{ did: "d1" }]],
    ["setGovernanceRoles", setGovernanceRoles, "roles", [{ role: "r1" }]],
    ["setGovernanceDID", setGovernanceDID, "did", "did:example:123"],
    ["setFileUploaded", setFileUploaded, "fileUploaded", true],
  ])("%s sets %s without touching other keys", (_name, creator, key, value) => {
    const next = reducer(initial, creator(value))
    expect(next[key]).toEqual(value)
    expect({ ...next, [key]: initial[key] }).toEqual(initial)
  })

  test("does not mutate the previous state", () => {
    const frozen = Object.freeze({ ...initial })
    expect(() => reducer(frozen, setGovernanceMetadata({ a: 1 }))).not.toThrow()
    expect(frozen.metadata).toEqual({})
  })

  test("clearGovernanceState resets everything", () => {
    let state = reducer(initial, setGovernanceMetadata({ format: "1.0" }))
    state = reducer(state, setGovernanceParticipants([{ did: "d1" }]))
    state = reducer(state, setFileUploaded(true))
    expect(reducer(state, clearGovernanceState())).toEqual(initial)
  })
})
