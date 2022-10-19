import React, { useRef, useEffect } from "react"
import { useSelector } from "react-redux"
// import { useTheme } from "styled-components"

import { setSelectedGovernance } from "../redux/governanceReducer"

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
} from "./CommonStylesForms"

function EditFormGovernanceMetadata(props) {
  //   const roles = useSelector((state) => state.users.roles)

  // const governanceMetadata = props.governanceMetadata
  const governanceState = useSelector((state) => state.governance)

  //   console.log(governanceMetadata)

  //   const [options, setOptions] = useState([])

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

    const form = new FormData(metadataForm.current)
    const name = form.get("name")
    const description = form.get("description")
    const version = form.get("version")
    const docs_uri = form.get("docs_uri")

    const metadata = {
      id: governanceState.selectedGovernance
        ? governanceState.selectedGovernance.id
        : null,
      name,
      description,
      version,
      docs_uri,
      selected: governanceState.selectedGovernance
        ? governanceState.selectedGovernance.selected
        : false,
    }

    setSelectedGovernance(metadata)
    // props.sendRequest("GOVERNANCE", "SET_METADATA", metadata)

    // (eldersonar) Wait 0.5 sec for the database to update and fetch fresh metadata
    // setTimeout(() => {
    //   props.sendRequest("GOVERNANCE", "GET_ALL_METADATA", {})
    // }, 500)

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
                <ModalLabel htmlFor="name">Name</ModalLabel>
                <InputFieldModal
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Country Health Governance"
                  defaultValue={
                    governanceState.selectedGovernance
                      ? governanceState.selectedGovernance.name
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
                  placeholder="Selected schemas and trusted issuers for the nation of 'country'"
                  defaultValue={
                    governanceState.selectedGovernance
                      ? governanceState.selectedGovernance.description
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
                    governanceState.selectedGovernance
                      ? governanceState.selectedGovernance.version
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
                    governanceState.selectedGovernance
                      ? governanceState.selectedGovernance.docs_uri
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
