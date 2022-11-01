import React, { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import styled from "styled-components"

import { setNotificationState } from "../../redux/notificationsReducer"
import GovernanceMetadataAdd from "./MetadataAdd"
import GovernanceMetadataEdit from "./MetadataEdit"
import {
  setSelectedGovernance,
  // clearGovernanceState,
} from "../../redux/governanceReducer"

import {
  handleMetadataInjection1_0,
  handleRolesInjection1_0,
  handleSchemasInjection1_0,
  handleIssuersInjection1_0,
  handleIssuersMetadataInjection1_0,
} from "../Formats/Format1/DataInjection1"

import { handleIssuersInjection2_0 } from "../Formats/Format2/DataInjection2"

import {
  handleMetadataExtraction1_0,
  handleSchemasExtraction1_0,
  handleIssuersExtraction1_0,
  handleRolesExtraction1_0,
} from "../Formats/Format1/DataExtraction1"

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
  margin: 5px;
  color: ${(props) => props.theme.text_light};
  border: none;
  float: right;
  box-shadow: ${(props) => props.theme.drop_shadow};
`
const ExportBtn = styled.button`
  width: 140px;
  background: ${(props) => props.theme.primary_color};
  padding: 10px;
  margin: 5px;
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

  const [addMetadataModalIsOpen, setAddMetadataModalIsOpen] = useState(false)
  const closeAddMetadataModal = () => setAddMetadataModalIsOpen(false)

  const addMetadata = () => {
    setAddMetadataModalIsOpen(true)
  }

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

  // (eldersonar) Handle data by format 1.0
  const uploadFormat1_0 = (file) => {
    handleMetadataInjection1_0(file, dispatch)
    handleRolesInjection1_0(file, dispatch)
    handleSchemasInjection1_0(file, dispatch)
    handleIssuersInjection1_0(file, dispatch)
    handleIssuersMetadataInjection1_0(file, dispatch)
  }

  // (eldersonar) Handle data by format 1.0
  const uploadFormat2_0 = (file) => {
    handleMetadataInjection1_0(file, dispatch)
    handleRolesInjection1_0(file, dispatch)
    handleSchemasInjection1_0(file, dispatch)
    handleIssuersInjection2_0(file, dispatch)
    handleIssuersMetadataInjection1_0(file, dispatch)
  }

  // (eldersonar) Handle governance injection based on the format type
  const handleGovernanceUpload = async (e) => {
    // (eldersonar) Store the version of the original governance file
    // (eldersonar) This is helpful for governance selection workflow
    dispatch(setSelectedGovernance(governanceFile))

    if (governanceFile && governanceFile.format === "1.0") {
      uploadFormat1_0(governanceFile)
    } else if (governanceFile && governanceFile.format === "2.0") {
      uploadFormat2_0(governanceFile)
    } else {
      // (eldersonar) Do we want to reject unsupported file formats or just inject data based on format 1.0?
      dispatch(
        setNotificationState({
          message: `Uploading a file that is not governance, or governance format is not supported`,
          type: "error",
        })
      )
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
        const fileName = "governance-framework-upload-test"
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
          message: `Governance file is not selected, or the governance format is not supported`,
          type: "error",
        })
      )
    }
  }

  const extractGovernance = () => {
    // (eldersonar) Save as UNIX timestamp
    const timestamp = Math.floor(Date.now() / 1000)

    let result = {}

    if (
      governanceState.metadata.format === "1.0" ||
      governanceState.metadata.format === "2.0"
    ) {
      console.log("calling extraction functions")
      const entries = handleIssuersExtraction1_0()
      const metadata = handleMetadataExtraction1_0(dispatch)
      const roles = {
        roles: Object.assign({}, ...handleRolesExtraction1_0()),
      }
      const schemas = { schemas: handleSchemasExtraction1_0() }
      const issuers = {}

      issuers.participants = {
        id: governanceState.issuersMetadata.id
          ? governanceState.issuersMetadata.id
          : "9b1deb4d-test-uuid-9bdd-2b0d7b3dcb6d",
        author: governanceState.issuersMetadata.author
          ? governanceState.issuersMetadata.author
          : "DID not anchored",
        created_at: timestamp,
        version: governanceState.issuersMetadata.version
          ? governanceState.issuersMetadata.version
          : governanceState.metadata.version,
        topic: governanceState.issuersMetadata.topic || "No topic provided",
        entries: Object.assign({}, ...entries), //convert an array of objects to a single object
      }

      result = {
        ...metadata,
        ...schemas,
        ...issuers,
        ...roles,
      }
      // (eldersonar) This is simulating final result of the governance file
      console.log(result)

      // (eldersonar) TODO: explore canonicalization and signatures

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
        <EditBtn
          onClick={() =>
            governanceState.metadata &&
            Object.keys(governanceState.metadata).length !== 0 &&
            Object.getPrototypeOf(governanceState.metadata) === Object.prototype
              ? editMetadata()
              : dispatch(
                  setNotificationState({
                    message:
                      "Can't edit metadata before selecting governance file",
                    type: "error",
                  })
                )
          }
        >
          Edit
        </EditBtn>
        <EditBtn onClick={() => addMetadata()}>Add</EditBtn>
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
        <ExportBtn onClick={() => downloadFile()}>Download to files</ExportBtn>
      </PageSection>
      <GovernanceMetadataAdd
        addMetadataModalIsOpen={addMetadataModalIsOpen}
        closeAddMetadataModal={closeAddMetadataModal}
      />
      <GovernanceMetadataEdit
        editMetadataModalIsOpen={editMetadataModalIsOpen}
        closeEditMetadataModal={closeEditMetadataModal}
      />
    </>
  )
}

export default Governance
