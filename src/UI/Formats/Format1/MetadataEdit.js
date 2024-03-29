import React, { useRef, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"

import { setGovernanceMetadata } from "../../../redux/governanceReducer"
import { setNotificationState } from "../../../redux/notificationsReducer"

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

function EditFormGovernanceMetadata(props) {
  const dispatch = useDispatch()

  const governanceState = useSelector((state) => state.governance)

  const error = props.error
  const metadataForm = useRef()
  const submitBtn = useRef()

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
      author: form.get("author"),
      id: form.get("id"),
      name: form.get("name"),
      description: form.get("description"),
      version: form.get("version"),
      format: form.get("format"),
      docs_uri: form.get("docs_uri"),
      last_updated: timestamp,
    }
    //(RomanStepanyan) Checking if any changes have been made
    if (
      governanceState.metadata.author !== metadata.author ||
      governanceState.metadata.id !== metadata.id ||
      governanceState.metadata.name !== metadata.name ||
      governanceState.metadata.description !== metadata.description ||
      governanceState.metadata.version !== metadata.version ||
      governanceState.metadata.format !== metadata.format ||
      governanceState.metadata.docs_uri !== metadata.docs_uri
    ) {
      dispatch(setGovernanceMetadata(metadata))
      dispatch(
        setNotificationState({
          message: "Governance Metadata has been changed",
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
        <ModalHeader>Update Governance Metadata</ModalHeader>
        <ModalContentWrapper>
          <ModalContent>
            <form id="form" onSubmit={handleSubmit} ref={metadataForm}>
              <InputBox>
                <ModalLabel htmlFor="author">Author</ModalLabel>
                <InputFieldModal
                  type="text"
                  name="author"
                  id="author"
                  placeholder="Country Health Governance"
                  defaultValue={
                    governanceState.metadata
                      ? governanceState.metadata.author
                      : ""
                  }
                />
              </InputBox>
              <InputBox>
                <ModalLabel htmlFor="id">Id</ModalLabel>
                <InputFieldModal
                  type="text"
                  name="id"
                  id="id"
                  placeholder="Country Health Governance"
                  defaultValue={
                    governanceState.metadata ? governanceState.metadata.id : ""
                  }
                />
              </InputBox>
              <InputBox>
                <ModalLabel htmlFor="name">Name</ModalLabel>
                <InputFieldModal
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Country Health Governance"
                  defaultValue={
                    governanceState.metadata
                      ? governanceState.metadata.name
                      : ""
                  }
                />
              </InputBox>
              <InputBox>
                <ModalLabel htmlFor="description">Description</ModalLabel>
                <InputFieldModal
                  type="text"
                  name="description"
                  id="description"
                  placeholder="Selected schemas and trusted participants for the nation of 'country'"
                  defaultValue={
                    governanceState.metadata
                      ? governanceState.metadata.description
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
                  placeholder="1.0"
                  defaultValue={
                    governanceState.metadata
                      ? governanceState.metadata.version
                      : ""
                  }
                />
              </InputBox>
              <InputBox>
                <ModalLabel htmlFor="format">Format</ModalLabel>
                <InputFieldModal
                  type="text"
                  name="format"
                  id="format"
                  placeholder="1.0"
                  defaultValue={
                    governanceState.metadata
                      ? governanceState.metadata.format
                      : ""
                  }
                />
              </InputBox>
              <InputBox>
                <ModalLabel htmlFor="docs_uri">
                  Human Readable Version URI
                </ModalLabel>
                <InputFieldModal
                  type="text"
                  name="docs_uri"
                  id="docs_uri"
                  placeholder="https://country.gov/health/2022-health-standards/index.html"
                  defaultValue={
                    governanceState.metadata
                      ? governanceState.metadata.docs_uri
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

export default EditFormGovernanceMetadata
