import React, { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import Select from "react-select"
import styled from "styled-components"

import PageHeader from "../../Core/PageHeader.js"
import PageSection from "../../Core/PageSection.js"

import {
  setGovernanceIssuers,
  setSelectedGovernanceSchema,
} from "../../../redux/governanceReducer"
import GovernanceSchemaEdit2 from "./SchemaEdit2"

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
  background: ${(props) => props.theme.primary_color};
  padding: 10px;
  color: ${(props) => props.theme.text_light};
  border: none;
  float: right;
  box-shadow: ${(props) => props.theme.drop_shadow};
`

function GovernanceSchema(props) {
  const dispatch = useDispatch()
  const governanceState = useSelector((state) => state.governance)
  const selectedSchema = governanceState.selectedSchema

  const schemaId = props.id
  const history = props.history

  useEffect(() => {
    // Handle selected schema
    if (governanceState.schemas) {
      let foundSchema = {}
      foundSchema = governanceState.schemas.find(
        (schema) =>
          schema.schema_id === parseInt(schemaId) &&
          schema.governance_id === governanceState.selectedGovernance.id
      )

      if (foundSchema) {
        console.log(foundSchema)
        dispatch(setSelectedGovernanceSchema(foundSchema))
      } else {
        // (eldersonar) TODO: Might want to display notification as well `The schema with id ${schemaId} doesn't exist or it doesn't belong to selected governance`
        if (history !== undefined) {
          history.push("/governance/schemas")
        }
      }

      let options = []

      if (governanceState.issuers) {
        // (eldersonar) Handle governance options state
        for (let i = 0; i < governanceState.issuers.length; i++) {
          options.push({
            id: governanceState.issuers[i].issuer_id,
            label: governanceState.issuers[i].name,
            value: governanceState.issuers[i].issuer_id,
          })
        }
        setIssuersOptions(options)

        // (eldersonar) Generate a list of issuers using this schema
        if (
          foundSchema &&
          foundSchema.issuer_roles &&
          foundSchema.issuer_roles.length
        ) {
          let list = []
          governanceState.issuers.forEach((element) => {
            for (let i = 0; i < foundSchema.issuer_roles.length; i++) {
              for (let k = 0; k < element.roles.length; k++) {
                if (element.roles[k] === foundSchema.issuer_roles[i]) {
                  list.push(element)
                }
              }
            }
          })
          setIssuersList(list)
        }
      }
    }
  }, [
    governanceState.schemas,
    governanceState.selectedGovernance,
    governanceState.issuers,
    schemaId,
    dispatch,
    history,
  ])

  const [schemaModalIsOpen, setSchemaModalIsOpen] = useState(false)
  const closeSchemaModal = () => setSchemaModalIsOpen(false)
  const editSchema = () => {
    setSchemaModalIsOpen(true)
  }

  const [issuersOptions, setIssuersOptions] = useState([])
  const [issuersList, setIssuersList] = useState([])
  const [selectedIssuer, setSelectedIssuer] = useState(null)

  function selectIsssuer(issuer) {
    setSelectedIssuer(issuer)
  }

  const OptionSelect = () => {
    return (
      <Select
        name="governance_issuer"
        placeholder="Select issuer..."
        defaultValue={selectedIssuer}
        options={issuersOptions}
        onChange={(e) => selectIsssuer(e)}
        menuPortalTarget={document.body}
      />
    )
  }

  const openIssuer = (history, id) => {
    if (history !== undefined) {
      history.push("/governance/issuers/" + id)
    }
  }

  const addIssuer = () => {
    console.log(selectedIssuer)
    const issuer = governanceState.issuers.find(
      (element) => element.issuer_id === selectedIssuer.id
    )

    // (eldersonar) Clear the dropdown selection
    setSelectedIssuer(null)

    // (eldersonar) Merge arrays without duplicates
    issuer.roles = [
      ...new Set([...issuer.roles, ...selectedSchema.issuer_roles]),
    ]

    // Update issuer with role
    let array = JSON.parse(JSON.stringify(governanceState.issuers)) // Creates a deep copy
    array = array.map((x) => (x.issuer_id === issuer.issuer_id ? issuer : x))

    dispatch(setGovernanceIssuers(array))
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
              <AttributeRow>
                <th>Creator:</th>
                <td>
                  {selectedSchema !== undefined
                    ? selectedSchema.creator || ""
                    : ""}
                </td>
              </AttributeRow>
            </tbody>
          </AttributeTable>
          <SaveBtn onClick={() => editSchema()}>Edit</SaveBtn>
        </PageSection>
        <PageSection>
          <GovernanceHeader>Issuers</GovernanceHeader>
          {issuersList.map((issuer) => (
            <ListItem
              key={issuer.issuer_id}
              onClick={() => {
                openIssuer(history, issuer.issuer_id)
              }}
            >
              {issuer.name}
            </ListItem>
          ))}
        </PageSection>
        <PageSection>
          <GovernanceHeader>Add Issuer</GovernanceHeader>
          <OptionSelect />
          <SaveBtn onClick={() => addIssuer()}>Add</SaveBtn>
        </PageSection>
        <GovernanceSchemaEdit2
          sendRequest={props.sendRequest}
          schemaModalIsOpen={schemaModalIsOpen}
          closeSchemaModal={closeSchemaModal}
        />
      </div>
    </>
  )
}

export default GovernanceSchema
