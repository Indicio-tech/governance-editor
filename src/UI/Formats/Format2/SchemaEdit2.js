import React, { useRef, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"

import {
  setSelectedGovernanceSchema,
  setGovernanceSchemas,
} from "../../../redux/governanceReducer"

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

function FormGovernanceSchema(props) {
  const dispatch = useDispatch()
  const governanceState = useSelector((state) => state.governance)
  const error = props.error
  const schemaForm = useRef()
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

    const form = new FormData(schemaForm.current)
    const id = form.get("id")
    const creator = form.get("creator")

    const schema = {
      schema_id: governanceState.selectedSchema.schema_id,
      governance_id: governanceState.selectedSchema.governance_id,
      name: form.get("name"),
      id,
      participant_roles: governanceState.selectedSchema
        ? governanceState.selectedSchema.participant_roles
        : [],
      creator,
    }

    let array = JSON.parse(JSON.stringify(governanceState.schemas)) // Creates a deep copy

    array = array.map((x) => (x.schema_id === schema.schema_id ? schema : x))

    dispatch(setSelectedGovernanceSchema(schema))
    dispatch(setGovernanceSchemas(array))

    props.closeSchemaModal()
  }

  function closeModal() {
    props.closeSchemaModal()
  }

  return (
    <StyledPopup
      open={props.schemaModalIsOpen}
      closeOnDocumentClick
      onClose={closeModal}
    >
      <LargeModal className="modal">
        <ModalHeader>Update Governance Participant</ModalHeader>
        <ModalContentWrapper>
          <ModalContent>
            <form id="form" onSubmit={handleSubmit} ref={schemaForm}>
              <InputBox>
                <ModalLabel htmlFor="name">Name</ModalLabel>
                <InputFieldModal
                  type="text"
                  name="name"
                  id="name"
                  defaultValue={
                    governanceState.selectedSchema
                      ? governanceState.selectedSchema.name
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
                  defaultValue={
                    governanceState.selectedSchema
                      ? governanceState.selectedSchema.id
                      : ""
                  }
                />
              </InputBox>
              <InputBox>
                <ModalLabel htmlFor="id">Creator</ModalLabel>
                <InputFieldModal
                  type="text"
                  name="creator"
                  id="creator"
                  defaultValue={
                    governanceState.selectedSchema
                      ? governanceState.selectedSchema.creator
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

export default FormGovernanceSchema
