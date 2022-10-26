import React, { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import Select from "react-select"

import PageHeader from "../../Core/PageHeader.js"
import PageSection from "../../Core/PageSection.js"
import styled from "styled-components"
import {
  setSelectedGovernanceIssuer,
  setGovernanceIssuers,
} from "../../../redux/governanceReducer"
import GovernanceIssuerEditV2 from "./GovernanceIssuerEditV2"

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

function GovernanceIssuer(props) {
  const dispatch = useDispatch()
  const governanceState = useSelector((state) => state.governance)
  const selectedIssuer = governanceState.selectedIssuer

  const issuerId = props.issuerId
  const history = props.history

  const [issuerModalIsOpen, setIssuerModalIsOpen] = useState(false)
  const [schemaOptions, setSchemaOptions] = useState([])
  const [schemaList, setSchemasList] = useState([])
  const [selectedSchema, setSelectedSchema] = useState(null)

  useEffect(() => {
    // Handle selected schema
    if (governanceState.issuers) {
      let foundIssuer = {}
      foundIssuer = governanceState.issuers.find(
        (issuer) =>
          issuer.issuer_id === parseInt(issuerId) &&
          issuer.governance_id === governanceState.selectedGovernance.id
      )

      if (foundIssuer) {
        console.log(foundIssuer)
        dispatch(setSelectedGovernanceIssuer(foundIssuer))
      } else {
        // (eldersonar) TODO: Might want to display notification as well `The issuer with id ${issuerId} doesn't exist or it doesn't belong to selected governance`
        if (history !== undefined) {
          console.log("redirect...")
          history.push("/governance/issuers")
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

      // (eldersonar) Set up the list of authorized to issue schemas
      if (foundIssuer && foundIssuer.roles && foundIssuer.roles.length) {
        let list = []
        governanceState.schemas.forEach((element) => {
          for (let k = 0; k < element.issuer_roles.length; k++) {
            for (let i = 0; i < foundIssuer.roles.length; i++) {
              if (element.issuer_roles[k] === foundIssuer.roles[i]) {
                list.push(element)
              }
            }
          }
        })
        console.log(list)
        setSchemasList(list)
      }
    }
  }, [
    governanceState.issuers,
    governanceState.selectedGovernance,
    governanceState.schemas,
    issuerId,
    dispatch,
    history,
  ])

  const closeIssuerModal = () => setIssuerModalIsOpen(false)
  const editIssuer = () => {
    setIssuerModalIsOpen(true)
  }

  function selectIsssuer(schema) {
    setSelectedSchema(schema)
  }

  const OptionSelect = () => {
    return (
      <Select
        name="governance_issuer"
        placeholder="Select issuer..."
        defaultValue={selectedSchema}
        options={schemaOptions}
        onChange={(e) => selectIsssuer(e)}
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
    const issuer = { ...selectedIssuer }

    const schema = governanceState.schemas.find(
      (item) => item.schema_id === selectedSchema.id
    )

    // (eldersonar) Clear the dropdown selection
    setSelectedSchema(null)

    // (eldersonar) Merge arrays without duplicates
    issuer.roles = [...new Set([...issuer.roles, ...schema.issuer_roles])]

    // Update issuer with role
    let array = JSON.parse(JSON.stringify(governanceState.issuers)) // Creates a deep copy
    array = array.map((x) => (x.issuer_id === issuer.issuer_id ? issuer : x))

    dispatch(setGovernanceIssuers(array))
  }

  return (
    <>
      <div id="issuer">
        <PageHeader title={"Issuer Details: " + (selectedIssuer.name || "")} />
        <PageSection>
          <GovernanceHeader>Issuer</GovernanceHeader>
          <AttributeTable>
            <tbody>
              <AttributeRow>
                <th>Name:</th>
                <td>
                  {selectedIssuer !== undefined
                    ? selectedIssuer.name || ""
                    : ""}
                </td>
              </AttributeRow>
              <AttributeRow>
                <th>DID:</th>
                <td>
                  {selectedIssuer !== undefined ? selectedIssuer.did || "" : ""}
                </td>
              </AttributeRow>
              <AttributeRow>
                <th>Website:</th>
                <td>
                  {selectedIssuer !== undefined
                    ? selectedIssuer.website || ""
                    : ""}
                </td>
              </AttributeRow>
              <AttributeRow>
                <th>Email:</th>
                <td>
                  {selectedIssuer !== undefined
                    ? selectedIssuer.email || ""
                    : ""}
                </td>
              </AttributeRow>
              <AttributeRow>
                <th>Phone:</th>
                <td>
                  {selectedIssuer !== undefined
                    ? selectedIssuer.phone || ""
                    : ""}
                </td>
              </AttributeRow>
              <AttributeRow>
                <th>Address:</th>
                <td>
                  {selectedIssuer !== undefined
                    ? selectedIssuer.address || ""
                    : ""}
                </td>
              </AttributeRow>
              <AttributeRow>
                <th>City:</th>
                <td>
                  {selectedIssuer !== undefined
                    ? selectedIssuer.city || ""
                    : ""}
                </td>
              </AttributeRow>
              <AttributeRow>
                <th>Zip:</th>
                <td>
                  {selectedIssuer !== undefined ? selectedIssuer.zip || "" : ""}
                </td>
              </AttributeRow>
              <AttributeRow>
                <th>State:</th>
                <td>
                  {selectedIssuer !== undefined
                    ? selectedIssuer.state || ""
                    : ""}
                </td>
              </AttributeRow>
            </tbody>
          </AttributeTable>
          <SaveBtn onClick={() => editIssuer()}>Edit</SaveBtn>
        </PageSection>
        <PageSection>
          <GovernanceHeader>Authorized to Issue</GovernanceHeader>
          {schemaList.map((schema) => (
            <ListItem
              key={schema.schema_id}
              onClick={() => {
                openSchema(history, schema.schema_id)
              }}
            >
              {schema.name}
            </ListItem>
          ))}
        </PageSection>
        <PageSection>
          <GovernanceHeader>Add Schema</GovernanceHeader>
          <OptionSelect />
          <SaveBtn onClick={() => addSchema()}>Add</SaveBtn>
        </PageSection>
        <GovernanceIssuerEditV2
          sendRequest={props.sendRequest}
          issuerModalIsOpen={issuerModalIsOpen}
          closeIssuerModal={closeIssuerModal}
        />
      </div>
    </>
  )
}

export default GovernanceIssuer
