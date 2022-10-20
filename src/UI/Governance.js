import React, { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import styled from "styled-components"

// import { setNotificationState } from '../redux/notificationsReducer'
import GovernanceMetadataEdit from "./GovernanceMetadataEdit"
import {
  setSelectedGovernance,
  setGovernanceMetadata,
  setGovernanceSchemas,
  // setSelectedGovernanceSchema,
  // setSelectedGovernanceIssuer,
  setGovernanceIssuers,
  setSelectedGovernanceIssuersMetadata,
  setGovernanceRoles,
  // setGovernanceDID,
} from "../redux/governanceReducer"

import PageHeader from "./PageHeader.js"
import PageSection from "./PageSection.js"
import { AttributeTable, AttributeRow } from "./CommonStylesTables"

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
const Input = styled.input``
const Form = styled.form`
  overflow: hidden;
  margin-bottom: 10px;
`
const SubmitFormBtn = styled.button``

function Governance() {
  const dispatch = useDispatch()
  const governanceState = useSelector((state) => state.governance)

  // const [selectedGovernance, setSelectedGovernance] = useState("trash")
  const [governanceFile, setGovernanceFile] = useState("Choose file")

  const [editMetadataModalIsOpen, setEditMetadataModalIsOpen] = useState(false)
  const closeEditMetadataModal = () => setEditMetadataModalIsOpen(false)

  const editMetadata = () => {
    console.log("setEditMetadataModalIsOpen(true)")
    setEditMetadataModalIsOpen(true)
  }

  let governanceSelectHandler = (event) => {
    const file = event.target.files[0]

    if (file) {
      const fileReader = new FileReader()
      fileReader.readAsText(event.target.files[0], "UTF-8")
      fileReader.onload = (e) => {
        // console.log("e.target.result", e.target.result);
        // setSelectedGovernance(e.target.result)

        setGovernanceFile(JSON.parse(e.target.result))
      }

      // setGovernanceFileName(event.target.files[0].name);
    }
  }

  const handleGovernanceUpload = async (e) => {
    e.preventDefault()

    if (governanceFile) {
      // (eldersonar) Handle metadata assembly
      let metadata = {
        description: governanceFile.description,
        docs_uri: governanceFile.docs_uri,
        format: governanceFile.format,
        id: governanceFile.id,
        last_updated: governanceFile.last_updated,
        name: governanceFile.name,
        version: governanceFile.version,
      }
      metadata["@context"] = governanceFile["@context"]

      // (eldersonar) Handle roles assembly
      const roles = []
      let role_id = 1
      roles.governance_id = governanceFile.id
      for (var key in governanceFile.roles) {
        let role = {}
        if (governanceFile.roles.hasOwnProperty(key)) {
          role.role_id = role_id
          role.governance_id = governanceFile.id
          role.role = key
          role.credentials = governanceFile.roles[key].credentials
            ? governanceFile.roles[key].credentials
            : {}

          // issuer.email =
          //   governanceFile.participants.entries[key][
          //     "uri:to-describe_schema"
          //   ].email
          // issuer.name =
          //   governanceFile.participants.entries[key][
          //     "uri:to-describe_schema"
          //   ].name
          // issuer.phone =
          //   governanceFile.participants.entries[key][
          //     "uri:to-describe_schema"
          //   ].phone
          // issuer.website =
          //   governanceFile.participants.entries[key][
          //     "uri:to-describe_schema"
          //   ].website
          // issuer.roles =
          //   governanceFile.participants.entries[key]["uri:to-role_schema"].roles

          roles.push(role)

          // Increment for unique id
          role_id++
        }
      }

      // (eldersonar) Handle schemas assembly
      let schemas = []
      let schema_id = 1
      governanceFile.schemas.forEach((schema) => {
        schema.schema_id = schema_id
        schema.governance_id = governanceFile.id
        schemas.push(schema)

        schema_id++
      })

      // (eldersonar) Handle issuers assembly
      let issuers = []
      let issuer_id = 1
      for (let key2 in governanceFile.participants.entries) {
        let issuer = {}
        if (governanceFile.participants.entries.hasOwnProperty(key2)) {
          issuer.issuer_id = issuer_id
          issuer.did = key2
          issuer.governance_id = governanceFile.id
          issuer.email =
            governanceFile.participants.entries[key2][
              "uri:to-describe_schema"
            ].email
          issuer.name =
            governanceFile.participants.entries[key2][
              "uri:to-describe_schema"
            ].name
          issuer.phone =
            governanceFile.participants.entries[key2][
              "uri:to-describe_schema"
            ].phone
          issuer.website =
            governanceFile.participants.entries[key2][
              "uri:to-describe_schema"
            ].website
          issuer.roles =
            governanceFile.participants.entries[key2][
              "uri:to-role_schema"
            ].roles

          issuers.push(issuer)

          // Increment for unique id
          issuer_id++
        }
      }

      // (eldersonar) Handle issuers metadata assembly
      let issuersMetadata = {
        author: governanceFile.participants.author,
        id: governanceFile.participants.id,
        created: governanceFile.participants.created,
        topic: governanceFile.participants.topic,
        version: governanceFile.participants.version,
      }

      // (eldersonar) Handle storage
      dispatch(setSelectedGovernance(governanceFile))
      dispatch(setGovernanceMetadata(metadata))
      dispatch(setGovernanceSchemas(governanceFile.schemas))
      dispatch(setGovernanceIssuers(issuers))
      dispatch(setSelectedGovernanceIssuersMetadata(issuersMetadata))
      dispatch(setGovernanceRoles(roles))
    } else {
      console.log("no governance")
    }
  }

  return (
    <>
      <PageHeader title="Ecosystem Governance" />
      <PageSection>
        <GovernanceHeader>Governance Metadata</GovernanceHeader>
        <AttributeTable>
          <tbody>
            <AttributeRow>
              <th>Name:</th>
              <td>
                {governanceState.metadata !== undefined
                  ? governanceState.metadata.name || ""
                  : ""}
              </td>
            </AttributeRow>
            <AttributeRow>
              <th>Description:</th>
              <td>
                {governanceState.metadata !== undefined
                  ? governanceState.metadata.description || ""
                  : ""}
              </td>
            </AttributeRow>
            <AttributeRow>
              <th>Version:</th>
              <td>
                {governanceState.metadata !== undefined
                  ? governanceState.metadata.version || ""
                  : ""}
              </td>
            </AttributeRow>
            <AttributeRow>
              <th>Human Readable Version URI:</th>
              <td>
                {governanceState.metadata !== undefined
                  ? governanceState.metadata.docs_uri || ""
                  : ""}
              </td>
            </AttributeRow>
            <AttributeRow>
              <th>Last Updated:</th>
              <td>
                {/* TODO: decide on the date format and handle it here */}
                {/* {governanceState.metadata === {}
                  ? new Date(governanceState.metadata.last_updated)
                      .toISOString()
                      .slice(0, 19)
                      .replace("T", " ") || ""
                  : ""} */}
                {governanceState.metadata !== {}
                  ? governanceState.metadata.last_updated || ""
                  : ""}
              </td>
            </AttributeRow>
          </tbody>
        </AttributeTable>
        <SaveBtn onClick={() => editMetadata()}>Edit</SaveBtn>
        <Form onSubmit={handleGovernanceUpload}>
          <Input
            type="file"
            accept=".json"
            onChange={governanceSelectHandler}
          ></Input>
          <SubmitFormBtn type="submit">Upload</SubmitFormBtn>
        </Form>
      </PageSection>
      <GovernanceMetadataEdit
        editMetadataModalIsOpen={editMetadataModalIsOpen}
        closeEditMetadataModal={closeEditMetadataModal}
      />
    </>
  )
}

export default Governance
