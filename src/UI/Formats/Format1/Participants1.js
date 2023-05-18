import React, { useRef, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import styled from "styled-components"

import { setGovernanceParticipants } from "../../../redux/governanceReducer"
import { setNotificationState } from "../../../redux/notificationsReducer"

import ParticipantsMetadataEdit from "./ParticipantMetadataEdit1"

import { getNextId } from "../../utils"

import PageHeader from "../../Core/PageHeader.js"
import PageSection from "../../Core/PageSection.js"

import { AttributeTable, AttributeRow } from "../../Styles/CommonStylesTables"

const Wrapper = styled.div``

const ParticipantsHolder = styled.div`
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

function GovernanceParticipants(props) {
  const dispatch = useDispatch()
  const governanceState = useSelector((state) => state.governance)
  const newParticipantForm = useRef()
  const history = props.history

  const [editMetadataModalIsOpen, setEditMetadataModalIsOpen] = useState(false)
  const closeEditMetadataModal = () => setEditMetadataModalIsOpen(false)

  const editParticipantsMetadata = () => {
    console.log("setEditMetadataModalIsOpen(true)")
    setEditMetadataModalIsOpen(true)
  }

  const openParticipant = (history, id) => {
    if (history !== undefined) {
      history.push("/governance/participants/" + id)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const form = new FormData(newParticipantForm.current)
    const name = form.get("name")

    if (!name) {
      dispatch(
        setNotificationState({
          message: "Can't create participant, please add participant name",
          type: "error",
        })
      )
    } else {
      if (governanceState.selectedGovernance.id) {
        // (eldersonar) Check for the name. Must be unique
        const participant = {
          participant_id: getNextId(
            governanceState.participants,
            "participant_id"
          ),
          did: "",
          governance_id: governanceState.selectedGovernance.id,
          name,
          website: "",
          email: "",
          phone: "",
          roles: [],
        }

        dispatch(
          setGovernanceParticipants([
            ...governanceState.participants,
            participant,
          ])
        )

        newParticipantForm.current.reset()
        dispatch(
          setNotificationState({
            message: "The new participant has been added",
            type: "notice",
          })
        )
      } else {
        dispatch(
          setNotificationState({
            message:
              "Can't create participant before selecting governance file",
            type: "error",
          })
        )
      }
    }
  }

  return (
    <>
      <PageHeader title="Participants" />
      <PageSection>
        <GovernanceHeader>Participants List</GovernanceHeader>
        <Wrapper>
          {governanceState.participants.map((participant) => (
            <ParticipantsHolder
              key={participant.participant_id}
              onClick={() => {
                openParticipant(history, participant.participant_id)
              }}
            >
              <div>{participant.name}</div>
            </ParticipantsHolder>
          ))}
        </Wrapper>
      </PageSection>
      <PageSection>
        <GovernanceHeader>Add Participant</GovernanceHeader>
        <form id="form" onSubmit={handleSubmit} ref={newParticipantForm}>
          <InputBox>
            <ModalLabel htmlFor="name">Participant Name</ModalLabel>
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
        <GovernanceHeader>Participants Metadata</GovernanceHeader>
        <SaveBtn
          onClick={() =>
            governanceState.metadata &&
            Object.keys(governanceState.metadata).length !== 0 &&
            Object.getPrototypeOf(governanceState.metadata) === Object.prototype
              ? editParticipantsMetadata()
              : dispatch(
                  setNotificationState({
                    message:
                      "Can't edit participants metadata before selecting governance file",
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
                {governanceState.participantsMetadata !== undefined
                  ? governanceState.participantsMetadata.id || ""
                  : ""}
              </td>
            </AttributeRow>
            <AttributeRow>
              <th>Author:</th>
              <td>
                {governanceState.metadata !== undefined
                  ? governanceState.metadata.author || ""
                  : ""}
              </td>
            </AttributeRow>
            <AttributeRow>
              <th>Created:</th>
              <td>
                {governanceState.participantsMetadata &&
                Object.keys(governanceState.participantsMetadata).length !==
                  0 &&
                Object.getPrototypeOf(governanceState.participantsMetadata) ===
                  Object.prototype
                  ? new Date(
                      governanceState.participantsMetadata.created * 1000
                    )
                      .toISOString()
                      .slice(0, 19)
                      .replace("T", " ") || ""
                  : ""}
              </td>
            </AttributeRow>
            <AttributeRow>
              <th>Version:</th>
              <td>
                {governanceState.participantsMetadata !== undefined
                  ? governanceState.participantsMetadata.version || ""
                  : ""}
              </td>
            </AttributeRow>
            <AttributeRow>
              <th>Topic:</th>
              <td>
                {governanceState.participantsMetadata !== undefined
                  ? governanceState.participantsMetadata.topic || ""
                  : ""}
              </td>
            </AttributeRow>
          </tbody>
        </AttributeTable>
      </PageSection>
      <ParticipantsMetadataEdit
        editMetadataModalIsOpen={editMetadataModalIsOpen}
        closeEditMetadataModal={closeEditMetadataModal}
      />
    </>
  )
}

export default GovernanceParticipants
