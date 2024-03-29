import React, { useRef, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"

import { setGovernanceParticipantsMetadata } from "../../../redux/governanceReducer"
import { setNotificationState } from "../../../redux/notificationsReducer"

import { v4 as uuidv4 } from "uuid"

import {
  Actions,
  CancelBtn,
  CloseBtn,
  InputBox,
  InputFieldModal,
  LargeModal,
  ModalContentWrapper,
  ModalContent,
  ModalHeader,
  ModalLabel,
  StyledPopup,
  SubmitBtnModal,
} from "../../Styles/CommonStylesForms"

function editParticipantsMetadata(props) {
  const dispatch = useDispatch()

  const governanceState = useSelector((state) => state.governance)

  const error = props.error
  const metadataForm = useRef()
  const submitBtn = useRef()

  const guid = uuidv4()

  useEffect(() => {
    if (error && submitBtn.current) {
      submitBtn.current.removeAttribute("disabled")
    }
  }, [error])

  // Disable button on submit
  const onBtnClick = (e) => {
    if (submitBtn.current) {
      submitBtn.current.setAttribute("disabled", "disabled")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    onBtnClick()

    // (eldersonar) Save as UNIX timestamp
    const timestamp = Math.floor(Date.now() / 1000)

    const form = new FormData(metadataForm.current)

    const metadata = {
      id: form.get("id"),
      author: form.get("author"),
      created: governanceState.metadata
        ? governanceState.metadata.last_updated
        : timestamp,
      version: form.get("version"),
      topic: form.get("topic"),
      last_updated: timestamp,
    }
    //(RomanStepanyan) Checking if any changes have been made
    if (
      governanceState.participantsMetadata.id !== metadata.id ||
      governanceState.participantsMetadata.version !==
        Number(metadata.version) ||
      governanceState.participantsMetadata.topic !== metadata.topic
    ) {
      dispatch(setGovernanceParticipantsMetadata(metadata))
      dispatch(
        setNotificationState({
          message: "Participants Metadata has been updated",
          type: "notice",
        })
      )
    } else {
      dispatch(
        setNotificationState({
          message: "No changes have been made",
          type: "warning",
        })
      )
    }

    props.closeEditMetadataModal()
  }

  function closeModal() {
    props.closeEditMetadataModal()
  }

  return (
    <StyledPopup
      open={props.editMetadataModalIsOpen}
      closeOnDocumentClick
      onClose={closeModal}
    >
      <LargeModal className="modal">
        <ModalHeader>Update Participants Metadata</ModalHeader>
        <ModalContentWrapper>
          <ModalContent>
            <form id="form" onSubmit={handleSubmit} ref={metadataForm}>
              <InputBox>
                <ModalLabel htmlFor="id">Id</ModalLabel>
                <InputFieldModal
                  type="text"
                  name="id"
                  id="id"
                  placeholder="32f54163-7166-48f1-93d8-ff217bdb0653"
                  defaultValue={
                    governanceState.participantsMetadata &&
                    governanceState.participantsMetadata.id
                      ? governanceState.participantsMetadata.id
                      : guid
                  }
                />
              </InputBox>
              <InputBox>
                <ModalLabel htmlFor="author">Author</ModalLabel>
                <InputFieldModal
                  type="text"
                  name="author"
                  id="author"
                  disabled
                  defaultValue={
                    governanceState.metadata
                      ? governanceState.metadata.author
                      : ""
                  }
                />
              </InputBox>
              <InputBox>
                <ModalLabel htmlFor="version">Version</ModalLabel>
                <InputFieldModal
                  type="text"
                  name="version"
                  id="version"
                  placeholder="2"
                  defaultValue={
                    governanceState.participantsMetadata
                      ? governanceState.participantsMetadata.version
                      : ""
                  }
                />
              </InputBox>
              <InputBox>
                <ModalLabel htmlFor="topic">Topic</ModalLabel>
                <InputFieldModal
                  type="text"
                  name="topic"
                  id="topic"
                  placeholder="uri:to-multi-topic-schema"
                  defaultValue={
                    governanceState.participantsMetadata
                      ? governanceState.participantsMetadata.topic
                      : ""
                  }
                />
              </InputBox>
              <Actions>
                <CancelBtn type="button" onClick={closeModal}>
                  Cancel
                </CancelBtn>
                <SubmitBtnModal type="submit" ref={submitBtn}>
                  Update
                </SubmitBtnModal>
              </Actions>
            </form>
          </ModalContent>
        </ModalContentWrapper>
        <CloseBtn onClick={closeModal}>&times;</CloseBtn>
      </LargeModal>
    </StyledPopup>
  )
}

export default editParticipantsMetadata
