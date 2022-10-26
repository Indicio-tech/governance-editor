import React, { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import styled from "styled-components"

import { setNotificationState } from "../../redux/notificationsReducer"
import GovernanceMetadataEdit from "../Core/GovernanceMetadataEdit"
import {
  setSelectedGovernance,
  setGovernanceMetadata,
  setGovernanceSchemas,
  setGovernanceIssuers,
  setSelectedGovernanceIssuersMetadata,
  setGovernanceRoles,
} from "../../redux/governanceReducer"

import PageHeader from "../Core/PageHeader.js"
import PageSection from "../Core/PageSection.js"
import { AttributeTable, AttributeRow } from "../Styles/CommonStylesTables"

const GovernanceHeader = styled.h3`
  display: inline-block;
  margin-right: 10px;
  margin-bottom: 0;
`
const EditBtn = styled.button`
  width: 80px;
  background: ${(props) => props.theme.primary_color};
  padding: 10px;
  color: ${(props) => props.theme.text_light};
  border: none;
  float: right;
  box-shadow: ${(props) => props.theme.drop_shadow};
`
const ExportBtn = styled.button`
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
        setGovernanceFile(JSON.parse(e.target.result))
      }
    }
  }

  // (eldersonar) Handle metadata assembly
  const handleMetadataInjection1_0 = () => {
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
    dispatch(setGovernanceMetadata(metadata))
  }

  // (eldersonar) Handle roles assembly
  const handleRolesInjection1_0 = () => {
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
  const handleSchemasInjection1_0 = () => {
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

  const handleIssuersInjection1_0 = () => {
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
          governanceFile.participants.entries[key][
            "uri:to-describe_schema"
          ].email
        issuer.name =
          governanceFile.participants.entries[key][
            "uri:to-describe_schema"
          ].name
        issuer.phone =
          governanceFile.participants.entries[key][
            "uri:to-describe_schema"
          ].phone
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

  const handleIssuersInjection2_0 = () => {
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
          governanceFile.participants.entries[key][
            "uri:to-describe_schema"
          ].email
        issuer.name =
          governanceFile.participants.entries[key][
            "uri:to-describe_schema"
          ].name
        issuer.phone =
          governanceFile.participants.entries[key][
            "uri:to-describe_schema"
          ].phone
        issuer.website =
          governanceFile.participants.entries[key][
            "uri:to-describe_schema"
          ].website
        issuer.address =
          governanceFile.participants.entries[key][
            "uri:to-describe_schema"
          ].address
        issuer.city =
          governanceFile.participants.entries[key][
            "uri:to-describe_schema"
          ].city
        issuer.zip =
          governanceFile.participants.entries[key]["uri:to-describe_schema"].zip
        issuer.state =
          governanceFile.participants.entries[key][
            "uri:to-describe_schema"
          ].state
        issuer.roles =
          governanceFile.participants.entries[key]["uri:to-role_schema"].roles

        issuers.push(issuer)

        // Increment for unique id
        issuer_id++
      }
    }
    dispatch(setGovernanceIssuers(issuers))
  }

  const handleIssuersMetadataInjection1_0 = () => {
    // (eldersonar) Handle issuers metadata assembly
    let issuersMetadata = {
      author: governanceFile.participants.author,
      id: governanceFile.participants.id,
      created: governanceFile.participants.created,
      topic: governanceFile.participants.topic,
      version: governanceFile.participants.version,
    }
    dispatch(setSelectedGovernanceIssuersMetadata(issuersMetadata))
  }

  // (eldersonar) Handle data by format 1.0
  const uploadFormat1_0 = () => {
    handleMetadataInjection1_0()
    handleRolesInjection1_0()
    handleSchemasInjection1_0()
    handleIssuersInjection1_0()
    handleIssuersMetadataInjection1_0()
  }

  // (eldersonar) Handle data by format 1.0
  const uploadFormat2_0 = () => {
    handleMetadataInjection1_0()
    handleRolesInjection1_0()
    handleSchemasInjection1_0()
    handleIssuersInjection2_0()
    handleIssuersMetadataInjection1_0()
  }

  // (eldersonar) Handle governance injection based on the format type
  const handleGovernanceUpload = async (e) => {
    // (eldersonar) Store the version of the original governance file
    // (eldersonar) This is helpful for governance selection workflow
    dispatch(setSelectedGovernance(governanceFile))

    if (governanceFile && governanceFile.format === "1.0") {
      uploadFormat1_0()
    } else if (governanceFile && governanceFile.format === "2.0") {
      uploadFormat2_0()
    } else {
      console.log("no governance")
    }
    e.preventDefault()
  }

  // (eldersonar) Handle goverance file download
  const downloadFile = () => {
    // (eldersonar) Fetch extracted governance file
    const file = extractGovernance()

    // Handle JSON file download
    if (file) {
      if (governanceState.issuersMetadata.author !== "DID not anchored") {
        // create file in browser
        const fileName = "governance-framework-downloaded"
        const json = JSON.stringify(file, null, 2)
        const blob = new Blob([json], { type: "application/json" })
        const href = URL.createObjectURL(blob)

        // create HTML element with href to file
        const link = document.createElement("a")
        link.href = href
        link.download = fileName + ".json"
        document.body.appendChild(link)
        link.click()

        // clean up element & remove ObjectURL to avoid memory leak
        document.body.removeChild(link)
        URL.revokeObjectURL(href)
      } else {
        dispatch(
          setNotificationState({
            message: "Publishing without public DID is forbidden",
            type: "error",
          })
        )
      }
    } else {
      dispatch(
        setNotificationState({
          message: `Error: governance file was not created. The governance file format ${governanceState.metadata.format} is not supported`,
          type: "error",
        })
      )
    }
  }

  // (eldersonar) Handle data clean and restructure for the metadata
  const handleMetadataExtraction1_0 = () => {
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
  const handleSchemasExtraction1_0 = () => {
    // const array = [...governanceState.schemas]
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
    })

    return schemasByGovernanceId
  }

  // (eldersonar) Handle data clean and restructure for the issuers
  const handleIssuersExtraction1_0 = () => {
    const array = JSON.parse(JSON.stringify(governanceState.issuers)) // Creates a deep copy

    let issuersByGovernanceId = []
    array.forEach((element) => {
      if (element.governance_id === governanceState.selectedGovernance.id) {
        issuersByGovernanceId.push(element)
      }
    })

    const finalEntries = []
    issuersByGovernanceId.forEach((issuer) => {
      delete issuer.created_at
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

      const participant = {}
      participant[issuer.did] = {
        "uri:to-role_schema": {
          roles: issuer.roles,
        },
        "uri:to-describe_schema": issuer,
      }

      delete issuer.roles

      finalEntries.push(participant)
    })
    return finalEntries
  }

  // (eldersonar) Handle data clean and restructure for the roles
  const handleRolesExtraction1_0 = () => {
    // const array = [...arr] // Creates a shallow copy that results in mutating the original issuers array
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

  const extractGovernance = () => {
    // (eldersonar) Save as UNIX timestamp
    const timestamp = Math.floor(Date.now() / 1000)

    let result = {}

    if (
      governanceState.metadata.format === "1.0" ||
      governanceState.metadata.format === "2.0"
    ) {
      const schemas = { schemas: handleSchemasExtraction1_0() }
      const entries = handleIssuersExtraction1_0()
      const roles = {
        roles: Object.assign({}, ...handleRolesExtraction1_0()),
      }
      const metadata = handleMetadataExtraction1_0()

      const issuers = {}

      issuers.participants = {
        id: governanceState.issuersMetadata.id
          ? governanceState.issuersMetadata.id
          : "9b1deb4d-test-uuid-9bdd-2b0d7b3dcb6d",
        author: governanceState.issuersMetadata.author
          ? governanceState.issuersMetadata.author
          : "DID not anchored",
        created_at: timestamp,
        version: governanceState.issuersMetadata.version,
        topic: governanceState.issuersMetadata.topic,
        entries: Object.assign({}, ...entries), //convert an array of objects to a single object
      }

      // if (issuers.participants.author !== "DID not anchored") {
      result = {
        ...metadata,
        ...schemas,
        ...issuers,
        ...roles,
      }
      // (eldersonar) This is simulating final result of the governance file
      console.log(result)

      return result
    } else {
      // (eldersonar) governance format is not supported
      return null
    }
  }

  return (
    <>
      <PageHeader title="Ecosystem Governance" />
      <PageSection>
        <GovernanceHeader>Governance Metadata</GovernanceHeader>
        <EditBtn onClick={() => editMetadata()}>Edit</EditBtn>
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
              <th>Format:</th>
              <td>
                {governanceState.metadata !== undefined
                  ? governanceState.metadata.format || ""
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
                {governanceState.metadata &&
                Object.keys(governanceState.metadata).length !== 0 &&
                Object.getPrototypeOf(governanceState.metadata) ===
                  Object.prototype
                  ? new Date(governanceState.metadata.last_updated * 1000)
                      .toISOString()
                      .slice(0, 19)
                      .replace("T", " ") || ""
                  : ""}
              </td>
            </AttributeRow>
          </tbody>
        </AttributeTable>
        <Form onSubmit={handleGovernanceUpload}>
          <Input
            type="file"
            accept=".json"
            onChange={governanceSelectHandler}
          ></Input>
          <SubmitFormBtn type="submit">Upload</SubmitFormBtn>
        </Form>
        <ExportBtn onClick={() => downloadFile()}>Publish</ExportBtn>
      </PageSection>
      <GovernanceMetadataEdit
        editMetadataModalIsOpen={editMetadataModalIsOpen}
        closeEditMetadataModal={closeEditMetadataModal}
      />
    </>
  )
}

export default Governance
