import store from "../../../store"

import { setGovernanceMetadata } from "../../../redux/governanceReducer"

// (eldersonar) Handle data clean and restructure for the metadata
export const handleMetadataExtraction1_0 = (dispatch) => {
  // (eldersonar) Fetch Redux store
  const currentState = store.getState()
  const governanceState = currentState.governance

  // (eldersonar) Save as UNIX timestamp
  const timestamp = Math.floor(Date.now() / 1000)

  const obj = JSON.parse(JSON.stringify(governanceState.metadata)) // Creates a deep copy
  obj.last_updated = timestamp
  // delete obj.selected // This is part of governance seletion feature (not presented here)

  // Update the metadata object too to keep it consistent with exported file
  dispatch(setGovernanceMetadata(obj))

  return obj
}

// (eldersonar) Handle data clean and restructure for the schemas
export const handleSchemasExtraction1_0 = () => {
  // (eldersonar) Fetch Redux store
  const currentState = store.getState()
  const governanceState = currentState.governance

  const array = JSON.parse(JSON.stringify(governanceState.schemas)) // Creates a deep copy

  let schemasByGovernanceId = []
  array.forEach((element) => {
    if (element.governance_id === governanceState.selectedGovernance.id) {
      schemasByGovernanceId.push(element)
    }
  })

  schemasByGovernanceId.forEach((schema) => {
    delete schema.created_at
    delete schema.updated_at
    delete schema.governance_id
    delete schema.schema_id

    // (eldersonar) Remove parts associated with format 2.0. Importand while downgrading the format type
    if (governanceState.metadata.format === "1.0") {
      delete schema.creator
    }
    // (eldersonar) Add placeholders if values are not provided
    else if (governanceState.metadata.format === "2.0") {
      schema.creator = schema.creator || ""
    }
  })

  return schemasByGovernanceId
}

// (eldersonar) Handle data clean and restructure for the participants
export const handleParticipantsExtraction1_0 = () => {
  // (eldersonar) Fetch Redux store
  const currentState = store.getState()
  const governanceState = currentState.governance

  const array = JSON.parse(JSON.stringify(governanceState.participants)) // Creates a deep copy

  let participantsByGovernanceId = []
  array.forEach((element) => {
    if (element.governance_id === governanceState.selectedGovernance.id) {
      participantsByGovernanceId.push(element)
    }
  })

  const finalEntries = {
    "https://example.com/roles.schema.json": {},
    "https://example.com/description.schema.json": {},
  }

  participantsByGovernanceId.forEach((participant) => {
    delete participant.updated_at
    delete participant.governance_id
    delete participant.participant_id

    // (eldersonar) Remove parts associated with format 2.0. Importand while downgrading the format type
    if (governanceState.metadata.format === "1.0") {
      delete participant.address
      delete participant.city
      delete participant.zip
      delete participant.state
    }
    // (eldersonar) Add placeholders if values are not provided
    else if (governanceState.metadata.format === "2.0") {
      participant.address = participant.address || ""
      participant.city = participant.city || ""
      participant.zip = participant.zip || ""
      participant.state = participant.state || ""
    }

    finalEntries["https://example.com/roles.schema.json"][participant.did] = {
      roles: participant.roles,
    }
    // Remove roles from the participant record
    delete participant.roles

    finalEntries["https://example.com/description.schema.json"][
      participant.did
    ] = {
      ...participant,
    }

    // Remove did from the participant record
    delete finalEntries["https://example.com/description.schema.json"][
      participant.did
    ].did
  })

  return finalEntries
}

// (eldersonar) Handle data clean and restructure for the roles
export const handleRolesExtraction1_0 = () => {
  // (eldersonar) Fetch Redux store
  const currentState = store.getState()
  const governanceState = currentState.governance

  console.log(governanceState.roles)

  const array = JSON.parse(JSON.stringify(governanceState.roles)) // Creates a deep copy

  let rolesByGovernanceId = []
  array.forEach((element) => {
    if (element.governance_id === governanceState.selectedGovernance.id) {
      rolesByGovernanceId.push(element)
    }
  })

  const finalEntries = []
  rolesByGovernanceId.forEach((role) => {
    delete role.created_at
    delete role.updated_at
    delete role.governance_id
    delete role.role_id

    const finalRole = {}

    console.log("role is ", role)

    if (role.action === "issue") {
      finalRole[role.role] = {
        issue: [role.subject[0]],
      }
    } else {
      finalRole[role.role] = {
        verify: [role.subject[0]],
      }
    }

    finalEntries.push(finalRole)
  })
  return finalEntries
}
