import React, { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import Select from "react-select"

import PageHeader from "../../Core/PageHeader.js"
import PageSection from "../../Core/PageSection.js"
import styled from "styled-components"
import {
  setSelectedGovernanceParticipant,
  setGovernanceParticipants,
} from "../../../redux/governanceReducer"
import GovernanceParticipantEditV2 from "./ParticipantEdit2"

// import { setNotificationState } from "../redux/notificationsReducer"

import { AttributeTable, AttributeRow } from "../../Styles/CommonStylesTables"

const ListItem = styled.div`
  color: blue;

  :hover {
    cursor: pointer;
    background: #ffc;
  }
`
const GovernanceHeader = styled.h3`
  display: inline-block;
  margin-right: 10px;
  margin-bottom: 0;
`
const SaveBtn = styled.button`
  width: 80px;
  background: ${(props) =>
    props.disabled ? "#808080" : props.theme.primary_color};
  padding: 10px;
  color: ${(props) => props.theme.text_light};
  border: none;
  float: right;
  box-shadow: ${(props) => props.theme.drop_shadow};
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
`

function GovernanceParticipant(props) {
  const dispatch = useDispatch()
  const governanceState = useSelector((state) => state.governance)
  const selectedParticipant = governanceState.selectedParticipant

  const participantId = props.participantId
  const history = props.history

  const [participantModalIsOpen, setParticipantModalIsOpen] = useState(false)
  const [schemaOptions, setSchemaOptions] = useState([])
  const [rolesOptions] = useState([
    {
      id: 1,
      label: "Issue",
      value: "issue",
    },
    {
      id: 2,
      label: "Verify",
      value: "verify",
    },
  ])
  const [schemaVerifyList, setSchemaVerifyList] = useState([])
  const [schemaIssueList, setSchemaIssueList] = useState([])
  const [selectedSchema, setSelectedSchema] = useState(null)
  const [selectedRole, setSelectedRole] = useState(null)

  const isDisabled = !selectedParticipant || !selectedRole

  useEffect(() => {
    // Handle selected schema
    if (governanceState.participants) {
      let foundParticipant = {}
      foundParticipant = governanceState.participants.find(
        (participant) =>
          participant.participant_id === parseInt(participantId) &&
          participant.governance_id === governanceState.selectedGovernance.id
      )

      if (foundParticipant) {
        dispatch(setSelectedGovernanceParticipant(foundParticipant))
      } else {
        // (eldersonar) TODO: Might want to display notification as well `The participant with id ${participantId} doesn't exist or it doesn't belong to selected governance`
        if (history !== undefined) {
          console.log("redirect...")
          history.push("/governance/participants")
        }
      }

      let options = []

      // (eldersonar) Handle governance options state
      if (governanceState.schemas) {
        for (let i = 0; i < governanceState.schemas.length; i++) {
          options.push({
            id: governanceState.schemas[i].schema_id,
            label: governanceState.schemas[i].name,
            value: governanceState.schemas[i].schema_id,
          })
        }
        setSchemaOptions(options)
      }

      if (foundParticipant && governanceState.schemas) {
        let availableRolesByParticipant = []

        // (eldersonar) Get a list of roles related to the selected participant
        for (let j = 0; j < governanceState.roles.length; j++) {
          for (let z = 0; z < foundParticipant.roles.length; z++) {
            if (governanceState.roles[j].role === foundParticipant.roles[z]) {
              availableRolesByParticipant.push(governanceState.roles[j])
            }
          }
        }

        // (eldersonar) Set up the list of authorized participants to work with a schema
        if (availableRolesByParticipant && availableRolesByParticipant.length) {
          // (eldersonar) Create a map of schema IDs and schema names
          const schemaMap = new Map(
            governanceState.schemas.map((schema) => [
              schema.id,
              schema.schema_id,
            ])
          )

          // (eldersonar) Filter available roles by participant that have matching roles
          const filteredRoles = availableRolesByParticipant.filter((role) => {
            // (eldersonar) Find the first participant in governanceState.participants that has the role and return a boolean value
            const participant = governanceState.participants.find(
              (participant) => participant.roles.includes(role.role)
            )
            return participant != null
          })

          // (eldersonar) Filter the filteredRoles to include only roles with action equal to "issue", map to an array of objects containing id, name, and action
          const issueList = filteredRoles
            .filter((role) => role.action === "issue")
            .map((role) => {
              // (eldersonar) Get the schema_id associated with the first subject in the role's subject array that exists in the schemaMap
              const schemaId = schemaMap.get(
                role.subject.find((subj) => schemaMap.has(subj))
              )
              // (eldersonar) Return an object containing the schemaId, name, and action
              return { id: schemaId, name: role.subject, action: role.action }
            })

          // (eldersonar) Filter the filteredRoles to include only roles with action equal to "verify", map to an array of objects containing id, name, and action
          const verifyList = filteredRoles
            .filter((role) => role.action === "verify")
            .map((role) => {
              // (eldersonar) Get the schema_id associated with the first subject in the role's subject array that exists in the schemaMap
              const schemaId = schemaMap.get(
                role.subject.find((subj) => schemaMap.has(subj))
              )
              // (eldersonar) Return an object containing the schemaId, name, and action
              return { id: schemaId, name: role.subject, action: role.action }
            })

          // (eldersonar) Remove duplicate schema issuance roles
          const cleanedParticipantList = [
            ...new Map(issueList.map((item) => [item["id"], item])).values(),
          ]

          // (eldersonar) Remove duplicate schema verification roles
          const cleanedVerifierList = [
            ...new Map(verifyList.map((item) => [item["id"], item])).values(),
          ]

          // (eldersonar) Update the schema issuance and verification lists with the cleaned lists
          setSchemaIssueList(cleanedParticipantList)
          setSchemaVerifyList(cleanedVerifierList)
        }
      }
    }
  }, [
    governanceState.participants,
    governanceState.selectedGovernance,
    governanceState.schemas,
    participantId,
    dispatch,
    history,
  ])

  const closeParticipantModal = () => setParticipantModalIsOpen(false)
  const editParticipant = () => {
    setParticipantModalIsOpen(true)
  }

  function selectParticipant(schema) {
    setSelectedSchema(schema)
  }

  function selectRole(role) {
    setSelectedRole(role)
  }

  const OptionSelect = () => {
    return (
      <Select
        name="governance_participant"
        placeholder="Select participant..."
        defaultValue={selectedSchema}
        options={schemaOptions}
        onChange={(e) => selectParticipant(e)}
        menuPortalTarget={document.body}
      />
    )
  }

  const RoleOptionSelect = () => {
    return (
      <Select
        name="governance_role"
        placeholder="Select a role..."
        defaultValue={selectedRole}
        options={rolesOptions}
        onChange={(e) => selectRole(e)}
        menuPortalTarget={document.body}
      />
    )
  }

  const openSchema = (history, id) => {
    if (history !== undefined) {
      history.push("/governance/schemas/" + id)
    }
  }

  const addSchema = () => {
    const participant = { ...selectedParticipant }

    const schema = governanceState.schemas.find(
      (item) => item.schema_id === selectedSchema.id
    )

    // (eldersonar) Get the role by role selected value and schema id
    const appliedRole = governanceState.roles.filter(
      (role) =>
        role.action === selectedRole.value && role.subject.includes(schema.id)
    )

    // (eldersonar) Clear the dropdown selection
    setSelectedSchema(null)
    setSelectedRole(null)

    // (eldersonar) Merge arrays without duplicates
    participant.roles = [
      ...new Set([...participant.roles, ...[appliedRole[0].role]]),
    ]

    // Update participant with role
    let array = JSON.parse(JSON.stringify(governanceState.participants)) // Creates a deep copy
    // Update the array with updated participant record
    array = array.map((x) =>
      x.participant_id === participant.participant_id ? participant : x
    )

    dispatch(setGovernanceParticipants(array))
  }

  return (
    <>
      <div id="participant">
        <PageHeader
          title={"Participant Details: " + (selectedParticipant.name || "")}
        />
        <PageSection>
          <GovernanceHeader>Participant</GovernanceHeader>
          <AttributeTable>
            <tbody>
              <AttributeRow>
                <th>Name:</th>
                <td>
                  {selectedParticipant !== undefined
                    ? selectedParticipant.name || ""
                    : ""}
                </td>
              </AttributeRow>
              <AttributeRow>
                <th>DID:</th>
                <td>
                  {selectedParticipant !== undefined
                    ? selectedParticipant.did || ""
                    : ""}
                </td>
              </AttributeRow>
              <AttributeRow>
                <th>Website:</th>
                <td>
                  {selectedParticipant !== undefined
                    ? selectedParticipant.website || ""
                    : ""}
                </td>
              </AttributeRow>
              <AttributeRow>
                <th>Email:</th>
                <td>
                  {selectedParticipant !== undefined
                    ? selectedParticipant.email || ""
                    : ""}
                </td>
              </AttributeRow>
              <AttributeRow>
                <th>Phone:</th>
                <td>
                  {selectedParticipant !== undefined
                    ? selectedParticipant.phone || ""
                    : ""}
                </td>
              </AttributeRow>
              <AttributeRow>
                <th>Address:</th>
                <td>
                  {selectedParticipant !== undefined
                    ? selectedParticipant.address || ""
                    : ""}
                </td>
              </AttributeRow>
              <AttributeRow>
                <th>City:</th>
                <td>
                  {selectedParticipant !== undefined
                    ? selectedParticipant.city || ""
                    : ""}
                </td>
              </AttributeRow>
              <AttributeRow>
                <th>Zip:</th>
                <td>
                  {selectedParticipant !== undefined
                    ? selectedParticipant.zip || ""
                    : ""}
                </td>
              </AttributeRow>
              <AttributeRow>
                <th>State:</th>
                <td>
                  {selectedParticipant !== undefined
                    ? selectedParticipant.state || ""
                    : ""}
                </td>
              </AttributeRow>
            </tbody>
          </AttributeTable>
          <SaveBtn onClick={() => editParticipant()}>Edit</SaveBtn>
        </PageSection>
        <PageSection>
          <GovernanceHeader>Authorized to Issue</GovernanceHeader>
          {schemaIssueList.map((schema) => (
            <ListItem
              key={schema.id}
              onClick={() => {
                openSchema(history, schema.id)
              }}
            >
              {schema.name}
            </ListItem>
          ))}
        </PageSection>
        <PageSection>
          <GovernanceHeader>Authorized to Verify</GovernanceHeader>
          {schemaVerifyList.map((schema) => (
            <ListItem
              key={schema.id}
              onClick={() => {
                openSchema(history, schema.id)
              }}
            >
              {schema.name}
            </ListItem>
          ))}
        </PageSection>
        <PageSection>
          <GovernanceHeader>Allow to</GovernanceHeader>
          <RoleOptionSelect />
          <GovernanceHeader>Schema</GovernanceHeader>
          <OptionSelect />
          <SaveBtn disabled={isDisabled} onClick={() => addSchema()}>
            Add
          </SaveBtn>
        </PageSection>
        <GovernanceParticipantEditV2
          sendRequest={props.sendRequest}
          participantModalIsOpen={participantModalIsOpen}
          closeParticipantModal={closeParticipantModal}
        />
      </div>
    </>
  )
}

export default GovernanceParticipant
