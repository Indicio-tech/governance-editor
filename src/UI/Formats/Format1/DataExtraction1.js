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

// (eldersonar) Handle data clean and restructure for the issuers
export const handleIssuersExtraction1_0 = () => {
  // (eldersonar) Fetch Redux store
  const currentState = store.getState()
  const governanceState = currentState.governance

  const array = JSON.parse(JSON.stringify(governanceState.issuers)) // Creates a deep copy

  let issuersByGovernanceId = []
  array.forEach((element) => {
    if (element.governance_id === governanceState.selectedGovernance.id) {
      issuersByGovernanceId.push(element)
    }
  })

  const finalEntries = []
  issuersByGovernanceId.forEach((issuer) => {
    // delete issuer.created
    delete issuer.updated_at
    delete issuer.governance_id
    delete issuer.issuer_id

    // (eldersonar) Remove parts associated with format 2.0. Importand while downgrading the format type
    if (governanceState.metadata.format === "1.0") {
      delete issuer.address
      delete issuer.city
      delete issuer.zip
      delete issuer.state
    }
    // (eldersonar) Add placeholders if values are not provided
    else if (governanceState.metadata.format === "2.0") {
      issuer.address = issuer.address || ""
      issuer.city = issuer.city || ""
      issuer.zip = issuer.zip || ""
      issuer.state = issuer.state || ""
    }

    const participant = {}
    participant[issuer.did] = {
      "uri:to-role_schema": {
        roles: issuer.roles,
      },
      "uri:to-describe_schema": issuer,
    }

    delete issuer.roles
    delete issuer.did

    finalEntries.push(participant)
  })
  return finalEntries
}

// (eldersonar) Handle data clean and restructure for the roles
export const handleRolesExtraction1_0 = () => {
  // (eldersonar) Fetch Redux store
  const currentState = store.getState()
  const governanceState = currentState.governance

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
    if (role.credentials.length !== 0) {
      finalRole[role.role] = {
        credentials: role.credentials,
      }
    } else {
      finalRole[role.role] = {}
    }

    finalEntries.push(finalRole)
  })
  return finalEntries
}
