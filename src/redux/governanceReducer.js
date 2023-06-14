/* eslint-disable import/no-anonymous-default-export */

const initialState = {
  selectedGovernance: {},
  // governanceOptions: [],
  metadata: {},
  selectedSchema: {},
  schemas: [],
  selectedParticipant: {},
  participants: [],
  participantsMetadata: {},
  roles: [],
  fileUploaded: false,
  did: null,
}

const SET_SELECTED_GOVERNANCE = "SET_SELECTED_GOVERNANCE"
const SET_GOVERNANCE_METADATA = "SET_GOVERNANCE_METADATA"
const SET_GOVERNANCE_SCHEMAS = "SET_GOVERNANCE_SCHEMAS"
const SET_SELECTED_GOVERNANCE_SCHEMA = "SET_SELECTED_GOVERNANCE_SCHEMA"
const SET_SELECTED_GOVERNANCE_PARTICIPANT =
  "SET_SELECTED_GOVERNANCE_PARTICIPANT"
const SET_GOVERNANCE_PARTICIPANTS = "SET_GOVERNANCE_PARTICIPANTS"
const SET_GOVERNANCE_PARTICIPANTS_METADATA =
  "SET_GOVERNANCE_PARTICIPANTS_METADATA"
const SET_GOVERNANCE_ROLES = "SET_GOVERNANCE_ROLES"
const SET_GOVERNANCE_DID = "SET_GOVERNANCE_DID"
// const SET_GOVERNANCE_OPTIONS = "SET_GOVERNANCE_OPTIONS"
const SET_GOVERNANCE_UPLOADED = "SET_GOVERNANCE_UPLOADED"
const CLEAR_GOVERNANCE_STATE = "CLEAR_GOVERNANCE_STATE"

export function setSelectedGovernance(selectedGovernance) {
  return {
    type: SET_SELECTED_GOVERNANCE,
    payload: selectedGovernance,
  }
}

export function setGovernanceMetadata(metadata) {
  return {
    type: SET_GOVERNANCE_METADATA,
    payload: metadata,
  }
}

export function setGovernanceSchemas(schemas) {
  return {
    type: SET_GOVERNANCE_SCHEMAS,
    payload: schemas,
  }
}

export function setSelectedGovernanceSchema(schema) {
  return {
    type: SET_SELECTED_GOVERNANCE_SCHEMA,
    payload: schema,
  }
}

export function setSelectedGovernanceParticipant(participant) {
  return {
    type: SET_SELECTED_GOVERNANCE_PARTICIPANT,
    payload: participant,
  }
}

export function setGovernanceParticipantsMetadata(participantsMetadata) {
  return {
    type: SET_GOVERNANCE_PARTICIPANTS_METADATA,
    payload: participantsMetadata,
  }
}

export function setGovernanceParticipants(participants) {
  return {
    type: SET_GOVERNANCE_PARTICIPANTS,
    payload: participants,
  }
}

export function setGovernanceRoles(roles) {
  return {
    type: SET_GOVERNANCE_ROLES,
    payload: roles,
  }
}

export function setGovernanceDID(did) {
  return {
    type: SET_GOVERNANCE_DID,
    payload: did,
  }
}

// export function setGovernanceOptions(governanceOptions) {
//   return {
//     type: SET_GOVERNANCE_OPTIONS,
//     payload: governanceOptions,
//   }
// }

export function setFileUploaded(fileUploaded) {
  return {
    type: SET_GOVERNANCE_UPLOADED,
    payload: fileUploaded,
  }
}

export function clearGovernanceState() {
  return {
    type: CLEAR_GOVERNANCE_STATE,
    payload: null,
  }
}

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_SELECTED_GOVERNANCE:
      return { ...state, selectedGovernance: action.payload }

    case SET_GOVERNANCE_METADATA:
      return { ...state, metadata: action.payload }

    case SET_GOVERNANCE_SCHEMAS:
      return { ...state, schemas: action.payload }

    case SET_SELECTED_GOVERNANCE_SCHEMA:
      return { ...state, selectedSchema: action.payload }

    case SET_SELECTED_GOVERNANCE_PARTICIPANT:
      return { ...state, selectedParticipant: action.payload }

    case SET_GOVERNANCE_PARTICIPANTS:
      return { ...state, participants: action.payload }

    case SET_GOVERNANCE_PARTICIPANTS_METADATA:
      return { ...state, participantsMetadata: action.payload }

    case SET_GOVERNANCE_ROLES:
      return { ...state, roles: action.payload }

    case SET_GOVERNANCE_DID:
      return { ...state, did: action.payload }

    // case SET_GOVERNANCE_OPTIONS:
    //   return { ...state, governanceOptions: action.payload }

    case SET_GOVERNANCE_UPLOADED:
      return { ...state, fileUploaded: action.payload }

    case CLEAR_GOVERNANCE_STATE:
      return initialState

    default:
      return state
  }
}
