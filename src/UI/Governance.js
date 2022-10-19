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

  const handleLogoSubmit = async (e) => {
    e.preventDefault()

    if (governanceState.selectedGovernance) {
      console.log(governanceFile)
      dispatch(setSelectedGovernance(governanceFile))

      console.log(governanceFile["@context"])

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
      dispatch(setGovernanceSchemas(governanceFile.schemas))
      dispatch(setGovernanceIssuers(governanceFile.participants.entries))
      dispatch(setGovernanceRoles(governanceFile.roles))
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
                {governanceState.metadata === {}
                  ? new Date(governanceState.metadata.updated_at)
                      .toISOString()
                      .slice(0, 19)
                      .replace("T", " ") || ""
                  : ""}
              </td>
            </AttributeRow>
          </tbody>
        </AttributeTable>
        <SaveBtn onClick={() => editMetadata()}>Edit</SaveBtn>
        <Form onSubmit={handleLogoSubmit}>
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
