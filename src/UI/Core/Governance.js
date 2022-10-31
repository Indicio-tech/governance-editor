// import { Dropbox } from "dropbox"
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

  // const dbxUploadFile = () => {
  //   const UPLOAD_FILE_SIZE_LIMIT = 150 * 1024 * 1024
  //   var fileInput = document.getElementById("file-upload")
  //   const dbx = new Dropbox({
  //     accessToken: process.env.REACT_APP_DROP_BOX_TOKEN,
  //     fetch,
  //   })
  //   var file = fileInput.files[0]

  //   if (file.size < UPLOAD_FILE_SIZE_LIMIT) {
  //     // File is smaller than 150 Mb - use filesUpload API
  //     dbx
  //       .filesUpload({ path: "/" + file.name, contents: file })
  //       .then(function (response) {
  //         var results = document.getElementById("results")
  //         var br = document.createElement("br")
  //         results.appendChild(document.createTextNode("File uploaded!"))
  //         results.appendChild(br)
  //         console.log(response)
  //       })
  //       .catch(function (error) {
  //         console.error(error)
  //       })
  //   } else {
  //     // File is bigger than 150 Mb - use filesUploadSession* API
  //     const maxBlob = 8 * 1000 * 1000 // 8Mb - Dropbox JavaScript API suggested max file / chunk size

  //     var workItems = []

  //     var offset = 0

  //     while (offset < file.size) {
  //       var chunkSize = Math.min(maxBlob, file.size - offset)
  //       workItems.push(file.slice(offset, offset + chunkSize))
  //       offset += chunkSize
  //     }

  //     const task = workItems.reduce((acc, blob, idx, items) => {
  //       if (idx === 0) {
  //         // Starting multipart upload of file
  //         return acc.then(function () {
  //           return dbx
  //             .filesUploadSessionStart({ close: false, contents: blob })
  //             .then((response) => response.session_id)
  //         })
  //       } else if (idx < items.length - 1) {
  //         // Append part to the upload session
  //         return acc.then(function (sessionId) {
  //           var cursor = { session_id: sessionId, offset: idx * maxBlob }
  //           return dbx
  //             .filesUploadSessionAppendV2({
  //               cursor: cursor,
  //               close: false,
  //               contents: blob,
  //             })
  //             .then(() => sessionId)
  //         })
  //       } else {
  //         // Last chunk of data, close session
  //         return acc.then(function (sessionId) {
  //           var cursor = {
  //             session_id: sessionId,
  //             offset: file.size - blob.size,
  //           }
  //           var commit = {
  //             path: "/" + file.name,
  //             mode: "add",
  //             autorename: true,
  //             mute: false,
  //           }
  //           return dbx.filesUploadSessionFinish({
  //             cursor: cursor,
  //             commit: commit,
  //             contents: blob,
  //           })
  //         })
  //       }
  //     }, Promise.resolve())

  //     task
  //       .then(function (result) {
  //         var results = document.getElementById("results")
  //         results.appendChild(document.createTextNode("File uploaded!"))
  //       })
  //       .catch(function (error) {
  //         console.error(error)
  //       })
  //   }
  //   return false
  // }

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
        // var data =
        //   "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(json))
        const href = URL.createObjectURL(blob)

        // console.log(fileName)
        // console.log(json)
        // console.log(blob)
        // console.log(typeof blob)
        // console.log(href)

        // create HTML element with href to file
        const link = document.createElement("a")
        link.href = href
        link.download = fileName + ".json"
        document.body.appendChild(link)
        link.click()

        // clean up element & remove ObjectURL to avoid memory leak
        document.body.removeChild(link)
        URL.revokeObjectURL(href)

        /**
         * Two variables should already be set.
         * dropboxToken = OAuth token received then signing in with OAuth.
         * file = file object selected in the file widget.
         */

        // var xhr = new XMLHttpRequest()

        // xhr.upload.onprogress = function (evt) {
        //   var percentComplete = parseInt((100.0 * evt.loaded) / evt.total)
        //   // Upload in progress. Do something here with the percent complete.
        // }

        // xhr.onload = function () {
        //   if (xhr.status === 200) {
        //     var fileInfo = JSON.parse(xhr.response)
        //     // Upload succeeded. Do something here with the file info.
        //   } else {
        //     var errorMessage = xhr.response || "Unable to upload file"
        //     // Upload failed. Do something here with the error.
        //   }
        // }

        // xhr.open("POST", "https://content.dropboxapi.com/2/files/save_url")
        // // xhr.open("POST", "https://content.dropboxapi.com/2/files/upload")
        // xhr.setRequestHeader(
        //   "Authorization",
        //   "Bearer " + process.env.REACT_APP_DROP_BOX_TOKEN
        // )
        // xhr.setRequestHeader("Content-Type", "application/octet-stream")
        // xhr.setRequestHeader(
        //   "Dropbox-API-Arg",
        //   {
        //     autorename: false,
        //     mode: "add",
        //     mute: false,
        //     path: "/Governance/governance-file.json",
        //     strict_conflict: false,
        //   }
        //   // JSON.stringify({
        //   //   path: "/" + href.name,
        //   //   mode: "add",
        //   //   autorename: true,
        //   //   mute: false,
        //   // })
        // )

        // // xhr.send(blob)
        // xhr.send({
        //   path: "/governance-file.json",
        //   url: "http://maps.googleapis.com/maps/api/geocode/json?address=google",
        // })

        // fetch("https://content.dropboxapi.com/2/files/upload", {
        //   mode: "no-cors",
        //   headers: {
        //     "Content-Type": "application/json",
        //     // "Content-Type": "application/octet-stream",
        //     // "Content-Type": "application/json",
        //     Authorization: `Bearer ${process.env.REACT_APP_DROP_BOX_TOKEN}`,
        //     "Dropbox-API-Arg": {
        //       autorename: true,
        //       mode: "add",
        //       mute: false,
        //       // path: href,
        //       strict_conflict: false,
        //     },
        //     //     "Authorization",
        //     // "Bearer " + process.env.DROP_BOX_TOKEN
        //     // Content-Type may need to be completely **omitted**
        //     // or you may need something
        //     // "Content-Type":
        //     //   "You will perhaps need to define a content-type here",
        //   },
        // })
        //   .then((response) => console.log(response))
        // .then((data) => console.log(data))

        // fetch("https://content.dropboxapi.com/2/files/upload", {
        //   // Your POST endpoint
        //   mode: "no-cors",
        //   method: "POST",
        //   // headers: {
        //   //   "Content-Type": "application/json",
        //   //   // "Content-Type": "application/octet-stream",
        //   //   // "Content-Type": "application/json",
        //   //   Authorization: `Bearer ${process.env.REACT_APP_DROP_BOX_TOKEN}`,
        //   //   "Dropbox-API-Arg": {
        //   //     autorename: true,
        //   //     mode: "add",
        //   //     mute: false,
        //   //     // path: href,
        //   //     strict_conflict: false,
        //   //   },
        //   //   //     "Authorization",
        //   //   // "Bearer " + process.env.DROP_BOX_TOKEN
        //   //   // Content-Type may need to be completely **omitted**
        //   //   // or you may need something
        //   //   // "Content-Type":
        //   //   //   "You will perhaps need to define a content-type here",
        //   // },
        //   // body: json, // This is your file object
        //   // data: {
        //   //   path: "/governance-file.json",
        //   //   url: "http://maps.googleapis.com/maps/api/geocode/json?address=google",
        //   // },
        // })
        //   .then(
        //     (response) => response.json() // if the response is a JSON object
        //   )
        //   .then(
        //     (success) => console.log(success) // Handle the success response object
        //   )
        //   .catch(
        //     (error) => console.log(error) // Handle the error response object
        //   )

        // Axios({
        //   method: "POST",
        //   // withCredentials: false,
        //   mode: "no-cors",
        //   // "Access-Control-Allow-Origin": "*",
        //   headers: {
        //     "Content-Type": "application/json",
        //     Authorization: `Bearer ${process.env.REACT_APP_DROP_BOX_TOKEN}`,
        //     "Dropbox-API-Arg": {
        //       autorename: true,
        //       mode: "add",
        //       mute: false,
        //       strict_conflict: false,
        //     },
        //   },
        //   data: {
        //     path: "/Governance/governance-file.json",
        //     url: "http://maps.googleapis.com/maps/api/geocode/json?address=google",
        //   },
        //   url: "https://content.dropboxapi.com/2/files/upload/save_url",
        // }).then((res) => {
        //   if (res.data.error) {
        //     console.log(res.data.error)
        //   }
        // })
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
        {/* <ExportBtn onClick={() => dbxUploadFile()}>Upload to DropBox</ExportBtn> */}
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
