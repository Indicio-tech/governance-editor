import React, { useRef, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import styled from "styled-components"

import { setGovernanceIssuers } from "../../../redux/governanceReducer"
import { setNotificationState } from "../../../redux/notificationsReducer"

import IssuersMetadataEdit from "../Format1/IssuerMetadataEdit1"

import { getNextId } from "../../utils"

import PageHeader from "../../Core/PageHeader.js"
import PageSection from "../../Core/PageSection.js"

import { AttributeTable, AttributeRow } from "../../Styles/CommonStylesTables"

const Wrapper = styled.div``

const IssuersHolder = styled.div`
  display: flex;
  justify-content: center;
  width: 75%;
  color: blue;

  :hover {
    cursor: pointer;
    background: #ffc;
  }
`
const InputBox = styled.div`
  margin: 10px;
  //   display: flex;
  //   justify-content: center;
`
const ModalLabel = styled.label`
  color: ${(props) => props.theme.text_color};
  //   font-size: 1.5em;
  //   width: 30%;
  margin-right: 10px;
`
const Input = styled.input`
  width: 300px;
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
const GovernanceHeader = styled.h3`
  display: inline-block;
  margin-right: 10px;
  margin-bottom: 0;
`

function GovernanceIssuers(props) {
  const dispatch = useDispatch()
  const governanceState = useSelector((state) => state.governance)
  const newIssuerForm = useRef()
  const history = props.history

  const [editMetadataModalIsOpen, setEditMetadataModalIsOpen] = useState(false)
  const closeEditMetadataModal = () => setEditMetadataModalIsOpen(false)

  const editIssuerMetadata = () => {
    console.log("setEditMetadataModalIsOpen(true)")
    setEditMetadataModalIsOpen(true)
  }

  const openIssuer = (history, id) => {
    if (history !== undefined) {
      history.push("/governance/issuers/" + id)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const form = new FormData(newIssuerForm.current)
    const name = form.get("name")

    if (governanceState.selectedGovernance.id) {
      // (eldersonar) Check for the name. Must be unique
      const issuer = {
        issuer_id: getNextId(governanceState.issuers, "issuer_id"),
        did: "",
        governance_id: governanceState.selectedGovernance.id,
        name,
        website: "",
        email: "",
        phone: "",
        roles: [],
      }

      dispatch(setGovernanceIssuers([...governanceState.issuers, issuer]))

      newIssuerForm.current.reset()
    } else {
      dispatch(
        setNotificationState({
          message: "Can't create issuer before selecting governance file",
          type: "error",
        })
      )
    }
  }

  return (
    <>
      <PageHeader title="Issuers" />
      <PageSection>
        <GovernanceHeader>Issuers List</GovernanceHeader>
        <Wrapper>
          {governanceState.issuers.map((issuer) => (
            <IssuersHolder
              key={issuer.issuer_id}
              onClick={() => {
                openIssuer(history, issuer.issuer_id)
              }}
            >
              <div>{issuer.name}</div>
            </IssuersHolder>
          ))}
        </Wrapper>
      </PageSection>
      <PageSection>
        <GovernanceHeader>Add Issuer</GovernanceHeader>
        <form id="form" onSubmit={handleSubmit} ref={newIssuerForm}>
          <InputBox>
            <ModalLabel htmlFor="name">Issuer Name</ModalLabel>
            <Input
              type="text"
              name="name"
              id="name"
              placeholder="Doctor's office"
            />
          </InputBox>
          <SaveBtn type="submit">Add</SaveBtn>
        </form>
      </PageSection>
      <PageSection>
        <GovernanceHeader>Issuers Metadata</GovernanceHeader>
        <SaveBtn
          onClick={() =>
            governanceState.metadata &&
            Object.keys(governanceState.metadata).length !== 0 &&
            Object.getPrototypeOf(governanceState.metadata) === Object.prototype
              ? editIssuerMetadata()
              : dispatch(
                  setNotificationState({
                    message:
                      "Can't edit issuers metadata before selecting governance file",
                    type: "error",
                  })
                )
          }
        >
          Edit
        </SaveBtn>
        <AttributeTable>
          <tbody>
            <AttributeRow>
              <th>Id:</th>
              <td>
                {governanceState.issuersMetadata !== undefined
                  ? governanceState.issuersMetadata.id || ""
                  : ""}
              </td>
            </AttributeRow>
            <AttributeRow>
              <th>Author:</th>
              <td>
                {governanceState.issuersMetadata !== undefined
                  ? governanceState.issuersMetadata.author || ""
                  : ""}
              </td>
            </AttributeRow>
            <AttributeRow>
              <th>Created:</th>
              <td>
                {governanceState.issuersMetadata &&
                Object.keys(governanceState.issuersMetadata).length !== 0 &&
                Object.getPrototypeOf(governanceState.issuersMetadata) ===
                  Object.prototype
                  ? new Date(governanceState.issuersMetadata.created * 1000)
                      .toISOString()
                      .slice(0, 19)
                      .replace("T", " ") || ""
                  : ""}
              </td>
            </AttributeRow>
            <AttributeRow>
              <th>Version:</th>
              <td>
                {governanceState.issuersMetadata !== undefined
                  ? governanceState.issuersMetadata.version || ""
                  : ""}
              </td>
            </AttributeRow>
            <AttributeRow>
              <th>Topic:</th>
              <td>
                {governanceState.issuersMetadata !== undefined
                  ? governanceState.issuersMetadata.topic || ""
                  : ""}
              </td>
            </AttributeRow>
          </tbody>
        </AttributeTable>
      </PageSection>
      <IssuersMetadataEdit
        editMetadataModalIsOpen={editMetadataModalIsOpen}
        closeEditMetadataModal={closeEditMetadataModal}
      />
    </>
  )
}

export default GovernanceIssuers
