import {
  setGovernanceMetadata,
  setGovernanceSchemas,
  setGovernanceParticipants,
  setGovernanceParticipantsMetadata,
  setGovernanceRoles,
} from "../../../redux/governanceReducer"

// (eldersonar) Handle metadata assembly
export const handleMetadataInjection1_0 = (governanceFile, dispatch) => {
  let metadata = {
    author: governanceFile.author,
    description: governanceFile.description,
    docs_uri: governanceFile.docs_uri,
    format: governanceFile.format,
    id: governanceFile.id,
    last_updated: governanceFile.last_updated,
    name: governanceFile.name,
    version: governanceFile.version,
  }
  metadata["@context"] = governanceFile["@context"]
  dispatch(setGovernanceMetadata(metadata))
}

// (eldersonar) Handle roles assembly
export const handleRolesInjection1_0 = (governanceFile, dispatch) => {
  const roles = []
  let role_id = 1
  roles.governance_id = governanceFile.id
  for (let key in governanceFile.roles) {
    let role = {}

    if (governanceFile.roles.hasOwnProperty(key)) {
      role.role_id = role_id
      role.governance_id = governanceFile.id
      role.role = key

      // (eldersonar) TODO: subject to change in future
      if ("issue" in governanceFile.roles[key]) {
        role.action = "issue"
        role.subject = governanceFile.roles[key].issue
      } else {
        role.action = "verify"
        role.subject = governanceFile.roles[key].verify
      }

      roles.push(role)

      // Increment for unique id
      role_id++
    }
  }
  dispatch(setGovernanceRoles(roles))
}

// (eldersonar) Handle schemas assembly
export const handleSchemasInjection1_0 = (governanceFile, dispatch) => {
  let schemas = []
  let schema_id = 1
  governanceFile.schemas.forEach((schema) => {
    schema.schema_id = schema_id
    schema.governance_id = governanceFile.id
    schemas.push(schema)

    schema_id++
  })
  dispatch(setGovernanceSchemas(governanceFile.schemas))
}

export const handleParticipantsInjection1_0 = (governanceFile, dispatch) => {
  // (eldersonar) Handle participants assembly
  let participants = []
  let participant_id = 1
  let roles =
    governanceFile.participants.entries["https://example.com/roles.schema.json"]
  let descriptions =
    governanceFile.participants.entries[
      "https://example.com/description.schema.json"
    ]

  for (const did in roles) {
    let participant = {}
    participant.participant_id = participant_id
    participant.did = did
    participant.governance_id = governanceFile.id
    participant.email = descriptions[did].email
    participant.name = descriptions[did].name
    participant.phone = descriptions[did].phone
    participant.website = descriptions[did].website
    participant.roles = []

    for (const role of roles[did].roles) {
      participant.roles.push(role)
    }
    participants.push(participant)
    participant_id++
  }

  dispatch(setGovernanceParticipants(participants))
}

export const handleParticipantsMetadataInjection1_0 = (
  governanceFile,
  dispatch
) => {
  // (eldersonar) Handle participants metadata assembly
  let participantsMetadata = {
    author: governanceFile.participants.author,
    id: governanceFile.participants.id,
    created: governanceFile.participants.created,
    topic: governanceFile.participants.topic,
    version: governanceFile.participants.version,
  }
  dispatch(setGovernanceParticipantsMetadata(participantsMetadata))
}
