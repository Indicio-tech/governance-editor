import Axios from "axios"
import React, { useState, useEffect, useRef, useCallback } from "react"
import { useSelector, useDispatch } from "react-redux"

import styled from "styled-components"

import { setNotificationState } from "../../redux/notificationsReducer"
import GovernanceMetadataAdd from "../Formats/Format1/MetadataAdd"
import GovernanceMetadataEdit from "../Formats/Format1/MetadataEdit"

import {
  setSelectedGovernance,
  setFileUploaded,
} from "../../redux/governanceReducer"

import {
  handleMetadataInjection1_0,
  handleRolesInjection1_0,
  handleSchemasInjection1_0,
  handleParticipantsInjection1_0,
  handleParticipantsMetadataInjection1_0,
} from "../Formats/Format1/DataInjection1"

import { handleParticipantsInjection2_0 } from "../Formats/Format2/DataInjection2"

import {
  handleMetadataExtraction1_0,
  handleSchemasExtraction1_0,
  handleParticipantsExtraction1_0,
  handleRolesExtraction1_0,
} from "../Formats/Format1/DataExtraction1"

import PageHeader from "../Core/PageHeader"
import PageSection from "../Core/PageSection"
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
const H3 = styled.h3`
  margin: 5px 0;
`

function Governance(props) {
  const dispatch = useDispatch()
  const governanceState = useSelector((state) => state.governance)

  const [selectedFile, setSelectedFile] = useState({})

  const [editMetadataModalIsOpen, setEditMetadataModalIsOpen] = useState(false)
  const closeEditMetadataModal = () => setEditMetadataModalIsOpen(false)

  const [addMetadataModalIsOpen, setAddMetadataModalIsOpen] = useState(false)
  const closeAddMetadataModal = () => setAddMetadataModalIsOpen(false)

  const governanceForm = useRef(null)
  const governancePath = useRef(null)

  const uploadFormat1_0 = useCallback(
    (file) => {
      handleMetadataInjection1_0(file, dispatch)
      handleRolesInjection1_0(file, dispatch)
      handleSchemasInjection1_0(file, dispatch)
      handleParticipantsInjection1_0(file, dispatch)
      handleParticipantsMetadataInjection1_0(file, dispatch)
    },
    [dispatch]
  )

  const uploadFormat2_0 = useCallback(
    (file) => {
      handleMetadataInjection1_0(file, dispatch)
      handleRolesInjection1_0(file, dispatch)
      handleSchemasInjection1_0(file, dispatch)
      handleParticipantsInjection2_0(file, dispatch)
      handleParticipantsMetadataInjection1_0(file, dispatch)
    },
    [dispatch]
  )

  const handleDataInjection = useCallback(() => {
    if (
      governanceState.selectedGovernance &&
      governanceState.selectedGovernance.format === "1.0"
    ) {
      uploadFormat1_0(governanceState.selectedGovernance)
    } else if (
      governanceState.selectedGovernance &&
      governanceState.selectedGovernance.format === "2.0"
    ) {
      uploadFormat2_0(governanceState.selectedGovernance)
    } else {
      // (eldersonar) Do we want to reject unsupported file formats or just inject data based on format 1.0?
      dispatch(
        setNotificationState({
          message: `Uploading a file that is not governance, or governance format is not supported`,
          type: "error",
        })
      )
    }
    dispatch(setFileUploaded(false))
  }, [governanceState, dispatch, uploadFormat1_0, uploadFormat2_0])

  useEffect(() => {
    if (
      governanceState.fileUploaded &&
      governanceState.selectedGovernance &&
      Object.keys(governanceState.selectedGovernance).length !== 0 &&
      Object.getPrototypeOf(governanceState.selectedGovernance) ===
        Object.prototype
    ) {
      handleDataInjection()
    }
  }, [
    governanceState.selectedGovernance,
    governanceState.fileUploaded,
    handleDataInjection,
  ])

  const addMetadata = () => {
    setAddMetadataModalIsOpen(true)
  }

  const editMetadata = () => {
    setEditMetadataModalIsOpen(true)
  }

  let governanceSelectHandler = (event) => {
    const file = event.target.files[0]

    if (file) {
      const fileReader = new FileReader()
      fileReader.readAsText(event.target.files[0], "UTF-8")
      fileReader.onload = (e) => {
        setSelectedFile(JSON.parse(e.target.result))
      }
    }
    dispatch(
      setNotificationState({
        message: `The governance file, ${file.name}, has been selected. Next, click on "Upload".`,
        type: "notice",
      })
    )
  }

  // (eldersonar) Handle governance injection based on the format type
  const handleGovernanceFileUpload = async (e) => {
    e.preventDefault()
    dispatch(setSelectedGovernance(selectedFile))
    dispatch(setFileUploaded(true))
  }

  // (eldersonar) Handle goverance file download
  const downloadFile = async () => {
    // (eldersonar) Fetch extracted governance file
    const file = await extractGovernance("download")

    // Handle JSON file download
    if (file) {
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
      dispatch(
        setNotificationState({
          message: "Selected governance file is downloaded",
          type: "notice",
        })
      )
    } else {
      dispatch(
        setNotificationState({
          message: `Governance file is not selected, or the governance format is not supported`,
          type: "error",
        })
      )
    }
  }

  const extractGovernance = async (action) => {
    // (eldersonar) Save as UNIX timestamp
    const timestamp = Math.floor(Date.now() / 1000)

    let result = {}

    if (
      governanceState.metadata.format === "1.0" ||
      governanceState.metadata.format === "2.0"
    ) {
      const entries = handleParticipantsExtraction1_0()
      const metadata = handleMetadataExtraction1_0(dispatch)
      const roles = {
        roles: Object.assign({}, ...handleRolesExtraction1_0()),
      }
      const schemas = { schemas: handleSchemasExtraction1_0() }
      const participants = {}

      participants.participants = {
        id: governanceState.participantsMetadata.id
          ? governanceState.participantsMetadata.id
          : "9b1deb4d-test-uuid-9bdd-2b0d7b3dcb6d",

        // (eldersonar) This is a temporary solution till the community decides on where the "author" lives
        author: governanceState.metadata.author
          ? governanceState.metadata.author
          : "DID not anchored",
        created: timestamp,
        version: governanceState.participantsMetadata.version
          ? governanceState.participantsMetadata.version
          : governanceState.metadata.version,
        topic:
          governanceState.participantsMetadata.topic || "No topic provided",
        entries,
      }

      result = {
        ...metadata,
        ...schemas,
        ...participants,
        ...roles,
      }
      // (eldersonar) This is simulating final result of the governance file
      console.log(result)
      return result
      // }
    } else {
      // (eldersonar) governance format is not supported
      return null
    }
  }

  const handleSubmit = (e) => {
    console.log("on handlesubmit")
    e.preventDefault()
    e.target.reset()
  }

  const uploadGovernanceViaAPI = async (e) => {
    e.preventDefault()
    const form = new FormData(governanceForm.current)
    const goverancePath = form.get("governance_path")

    //(RomanStepanyan) Checking if a URL starts with http or https
    const urlMatch =
      goverancePath.match("http://") || goverancePath.match("https://")
    if (urlMatch && urlMatch.index === 0) {
      try {
        const response = await Axios({
          method: "get",
          url: "https://governance-file-hosting.glitch.me/file",
        })
        console.log(response.data)
        dispatch(setSelectedGovernance(response.data))
        dispatch(setFileUploaded(true))
      } catch (error) {
        console.error(error)
      }
    } else {
      return dispatch(
        setNotificationState({
          message:
            "URL address is not correct and governance file can't be selected",
          type: "error",
        })
      )
    }
    governanceForm.current.reset()
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
        <EditBtn onClick={() => addMetadata()}>Create</EditBtn>
        <AttributeTable>
          <tbody>
            <AttributeRow>
              <th>Author:</th>
              <td>
                {governanceState.metadata !== undefined
                  ? governanceState.metadata.author || ""
                  : ""}
              </td>
            </AttributeRow>
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
        <H3>Get governance from files</H3>
        <Form onSubmit={handleGovernanceFileUpload}>
          <Input
            type="file"
            accept=".json"
            onChange={governanceSelectHandler}
          ></Input>
          <SubmitFormBtn type="submit">Upload</SubmitFormBtn>
        </Form>
        <hr></hr>
        <Form onSubmit={handleSubmit} ref={governanceForm}>
          <H3>Get governance via API</H3>
          <Input
            type="url"
            name="governance_path"
            ref={governancePath}
            placeholder="https://mrg.com/governance.json"
            required
          />
          <SubmitFormBtn type="submit" onClick={uploadGovernanceViaAPI}>
            Upload
          </SubmitFormBtn>
        </Form>
        <hr></hr>
        <ExportBtn onClick={() => downloadFile()}>Download</ExportBtn>
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
