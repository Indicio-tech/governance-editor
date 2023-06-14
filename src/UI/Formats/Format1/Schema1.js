import React, { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import Select from "react-select"
import styled from "styled-components"

import PageHeader from "../../Core/PageHeader.js"
import PageSection from "../../Core/PageSection.js"

import {
  setGovernanceParticipants,
  setSelectedGovernanceSchema,
} from "../../../redux/governanceReducer"
import GovernanceSchemaEdit1 from "./SchemaEdit1"

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

function GovernanceSchema(props) {
  const dispatch = useDispatch()
  const governanceState = useSelector((state) => state.governance)
  const selectedSchema = governanceState.selectedSchema

  const [schemaModalIsOpen, setSchemaModalIsOpen] = useState(false)
  const closeSchemaModal = () => setSchemaModalIsOpen(false)
  const editSchema = () => {
    setSchemaModalIsOpen(true)
  }

  const [participantsOptions, setParticipantsOptions] = useState([])
  const [rolesOptions, setRolesOptions] = useState([])
  const [participantVerifyList, setParticipantVerifyList] = useState([])
  const [participantIssueList, setParticipantIssueList] = useState([])
  const [selectedParticipant, setSelectedParticipant] = useState(null)
  const [selectedRole, setSelectedRole] = useState(null)

  const isDisabled = !selectedParticipant || !selectedRole

  const schemaId = props.id
  const history = props.history

  useEffect(() => {
    // Handle selected schema
    let foundSchema = {}
    if (governanceState.schemas) {
      foundSchema = governanceState.schemas.find(
        (schema) =>
          schema.schema_id === parseInt(schemaId) &&
          schema.governance_id === governanceState.selectedGovernance.id
      )

      if (foundSchema) {
        dispatch(setSelectedGovernanceSchema(foundSchema))
      } else {
        // (eldersonar) TODO: Might want to display notification as well `The schema with id ${schemaId} doesn't exist or it doesn't belong to selected governance`
        if (history !== undefined) {
          history.push("/governance/schemas")
        }
      }

      let options = []
      let rOptions = []

      if (governanceState.participants) {
        // (eldersonar) Handle governance options state
        for (let i = 0; i < governanceState.participants.length; i++) {
          options.push({
            id: governanceState.participants[i].participant_id,
            label: governanceState.participants[i].name,
            value: governanceState.participants[i].participant_id,
          })
        }
        setParticipantsOptions(options)

        if (foundSchema && governanceState.participants) {
          let availableRolesBySchema = []

          // (eldersonar) Get a list of roles related to the selected schema
          for (let j = 0; j < governanceState.roles.length; j++) {
            if (governanceState.roles[j].subject.includes(foundSchema.id)) {
              console.log(governanceState.roles[j])
              availableRolesBySchema.push(governanceState.roles[j])
            }
          }

          // (eldersonar) Set up the list of authorized participants to work with a schema
          if (availableRolesBySchema && availableRolesBySchema.length) {
            // (eldersonar) Create a Map of schema IDs and schema_id values
            const schemaMap = new Map(
              governanceState.schemas.map((schema) => [
                schema.id,
                schema.schema_id,
              ])
            )

            // (eldersonar) Create two arrays to store participants who have issue and verify roles
            const issueList = []
            const verifyList = []

            // (eldersonar) Loop through each participant and each of their roles to check if they are authorized to work with the schema
            governanceState.participants.forEach((participant) => {
              participant.roles.forEach((role) => {
                // (eldersonar) Check if the role is in the availableRolesBySchema array
                const roleInSchema = availableRolesBySchema.find(
                  (schemaRole) => schemaRole.role === role
                )
                if (roleInSchema) {
                  // (eldersonar) Add participant to the issueList or verifyList based on the action in the role
                  if (roleInSchema.action === "issue") {
                    issueList.push({
                      id: participant.participant_id,
                      name: participant.name,
                      action: roleInSchema.action,
                    })
                  } else if (roleInSchema.action === "verify") {
                    verifyList.push({
                      id: participant.participant_id,
                      name: participant.name,
                      action: roleInSchema.action,
                    })
                  }
                }
              })
            })

            // (eldersonar) Remove duplicate records from the array of objects using the Map approach
            const cleanedParticipantList = [
              ...new Map(issueList.map((item) => [item["id"], item])).values(),
            ]
            const cleanedVerifierList = [
              ...new Map(verifyList.map((item) => [item["id"], item])).values(),
            ]

            // (eldersonar) Set the cleaned lists as the state variables
            setParticipantIssueList(cleanedParticipantList)
            setParticipantVerifyList(cleanedVerifierList)
          }
        }
      }

      // (eldersonar) TODO: subject to change in future
      if (governanceState.roles) {
        // (eldersonar) Handle governance options state
        for (let i = 0; i < governanceState.roles.length; i++) {
          if (foundSchema.id === governanceState.roles[i].subject[0]) {
            rOptions.push({
              id: governanceState.roles[i].role_id,
              label:
                governanceState.roles[i].action === "issue"
                  ? "Issuer"
                  : "Verifier",
              value: governanceState.roles[i].role,
            })
          }
        }
        setRolesOptions(rOptions)
      }
    }
  }, [
    governanceState.schemas,
    governanceState.selectedGovernance,
    governanceState.participants,
    schemaId,
    dispatch,
    history,
  ])

  function selectParticipant(participant) {
    setSelectedParticipant(participant)
  }

  function selectRole(role) {
    setSelectedRole(role)
  }

  const OptionSelect = () => {
    return (
      <Select
        name="governance_participant"
        placeholder="Select participant..."
        defaultValue={selectedParticipant}
        options={participantsOptions}
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

  const openParticipant = (history, id) => {
    if (history !== undefined) {
      history.push("/governance/participants/" + id)
    }
  }

  const assignParticipantRole = () => {
    const participant = governanceState.participants.find(
      (element) => element.participant_id === selectedParticipant.id
    )

    // (eldersonar) Clear the dropdown selection
    setSelectedParticipant(null)
    setSelectedRole(null)

    // (eldersonar) Merge arrays without duplicates
    participant.roles = [
      ...new Set([...participant.roles, ...[selectedRole.value]]),
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
      <div id="schema">
        <PageHeader title={"Schema Details: " + (selectedSchema.name || "")} />
        <PageSection>
          <GovernanceHeader>Schema</GovernanceHeader>
          <AttributeTable>
            <tbody>
              <AttributeRow>
                <th>Name:</th>
                <td>
                  {selectedSchema !== undefined
                    ? selectedSchema.name || ""
                    : ""}
                </td>
              </AttributeRow>
              <AttributeRow>
                <th>Id:</th>
                <td>
                  {selectedSchema !== undefined ? selectedSchema.id || "" : ""}
                </td>
              </AttributeRow>
            </tbody>
          </AttributeTable>
          <SaveBtn onClick={() => editSchema()}>Edit</SaveBtn>
        </PageSection>
        <PageSection>
          <GovernanceHeader>Issuers</GovernanceHeader>
          {participantIssueList.map((participant) => (
            <ListItem
              key={participant.id}
              onClick={() => {
                openParticipant(history, participant.id)
              }}
            >
              {participant.name}
            </ListItem>
          ))}
        </PageSection>

        <PageSection>
          <GovernanceHeader>Verifiers</GovernanceHeader>
          {participantVerifyList.map((participant) => (
            <ListItem
              key={participant.id}
              onClick={() => {
                openParticipant(history, participant.id)
              }}
            >
              {participant.name}
            </ListItem>
          ))}
        </PageSection>
        <PageSection>
          <GovernanceHeader>Add</GovernanceHeader>
          <OptionSelect />
          <GovernanceHeader>As</GovernanceHeader>
          <RoleOptionSelect />
          <SaveBtn
            disabled={isDisabled}
            onClick={() => assignParticipantRole()}
          >
            Add
          </SaveBtn>
        </PageSection>
        <GovernanceSchemaEdit1
          sendRequest={props.sendRequest}
          schemaModalIsOpen={schemaModalIsOpen}
          closeSchemaModal={closeSchemaModal}
        />
      </div>
    </>
  )
}

export default GovernanceSchema
