import {
  setGovernanceMetadata,
  setGovernanceSchemas,
  setGovernanceIssuers,
  setGovernanceIssuersMetadata,
  setGovernanceRoles,
} from "../../../redux/governanceReducer"

// This results in error...
// import { useDispatch } from "react-redux"
// const dispatch = useDispatch()

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
      role.credentials = governanceFile.roles[key].credentials
        ? governanceFile.roles[key].credentials
        : []

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

export const handleIssuersInjection1_0 = (governanceFile, dispatch) => {
  // (eldersonar) Handle issuers assembly
  let issuers = []
  let issuer_id = 1
  for (let key in governanceFile.participants.entries) {
    let issuer = {}
    if (governanceFile.participants.entries.hasOwnProperty(key)) {
      issuer.issuer_id = issuer_id
      issuer.did = key
      issuer.governance_id = governanceFile.id
      issuer.email =
        governanceFile.participants.entries[key]["uri:to-describe_schema"].email
      issuer.name =
        governanceFile.participants.entries[key]["uri:to-describe_schema"].name
      issuer.phone =
        governanceFile.participants.entries[key]["uri:to-describe_schema"].phone
      issuer.website =
        governanceFile.participants.entries[key][
          "uri:to-describe_schema"
        ].website
      issuer.roles =
        governanceFile.participants.entries[key]["uri:to-role_schema"].roles

      issuers.push(issuer)

      // Increment for unique id
      issuer_id++
    }
  }
  dispatch(setGovernanceIssuers(issuers))
}

export const handleIssuersMetadataInjection1_0 = (governanceFile, dispatch) => {
  // (eldersonar) Handle issuers metadata assembly
  let issuersMetadata = {
    author: governanceFile.participants.author,
    id: governanceFile.participants.id,
    created: governanceFile.participants.created,
    topic: governanceFile.participants.topic,
    version: governanceFile.participants.version,
  }
  dispatch(setGovernanceIssuersMetadata(issuersMetadata))
}
