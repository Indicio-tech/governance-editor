import React, { useRef, useEffect } from "react"
import { useDispatch } from "react-redux"

import {
  setGovernanceMetadata,
  setSelectedGovernance,
} from "../../redux/governanceReducer"

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
} from "../Styles/CommonStylesForms"

function AddFormGovernanceMetadata(props) {
  const dispatch = useDispatch()

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
      id: form.get("id"),
      name: form.get("name"),
      description: form.get("description"),
      version: form.get("version"),
      format: form.get("format"),
      docs_uri: form.get("docs_uri"),
      // selected: false,
      last_updated: timestamp,
      "@context": [
        "https://github.com/hyperledger/aries-rfcs/blob/main/concepts/0430-machine-readable-governance-frameworks/context.jsonld",
      ],
    }

    let governanceTemplate = {}
    governanceTemplate = {
      ...metadata,
      schemas: {},
      participants: {},
      roles: {},
    }

    dispatch(setSelectedGovernance(governanceTemplate))
    dispatch(setGovernanceMetadata(metadata))

    props.closeAddMetadataModal()
  }

  function closeModal() {
    // setOptions([])
    props.closeAddMetadataModal()
  }

  return (
    <StyledPopup
      open={props.addMetadataModalIsOpen}
      closeOnDocumentClick
      onClose={closeModal}
    >
      <LargeModal className="modal">
        <ModalHeader>Add Governance Metadata</ModalHeader>
        <ModalContentWrapper>
          <ModalContent>
            <form id="form" onSubmit={handleSubmit} ref={metadataForm}>
              <InputBox>
                <ModalLabel htmlFor="id">Id</ModalLabel>
                <InputFieldModal
                  type="text"
                  name="id"
                  id="id"
                  placeholder="<uuid>"
                />
              </InputBox>
              <InputBox>
                <ModalLabel htmlFor="name">Name</ModalLabel>
                <InputFieldModal
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Country Health Governance"
                />
              </InputBox>
              <InputBox>
                <ModalLabel htmlFor="description">Description</ModalLabel>
                <InputFieldModal
                  type="text"
                  name="description"
                  id="description"
                  placeholder="Selected schemas and trusted issuers for the nation of 'country'"
                />
              </InputBox>
              <InputBox>
                <ModalLabel htmlFor="version">Version</ModalLabel>
                <InputFieldModal
                  type="text"
                  name="version"
                  id="version"
                  placeholder="1.0"
                />
              </InputBox>
              <InputBox>
                <ModalLabel htmlFor="format">Format</ModalLabel>
                <InputFieldModal
                  type="text"
                  name="format"
                  id="format"
                  placeholder="1.0"
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
                />
              </InputBox>
              <Actions>
                <CancelBtn type="button" onClick={closeModal}>
                  Cancel
                </CancelBtn>
                <SubmitBtnModal type="submit" ref={submitBtn}>
                  Add
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

export default AddFormGovernanceMetadata
