import React, { useRef, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"

import {
  setSelectedGovernanceParticipant,
  setGovernanceParticipants,
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

function FormGovernanceParticipant(props) {
  const dispatch = useDispatch()
  const governanceState = useSelector((state) => state.governance)
  const error = props.error

  const participantForm = useRef()
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

    const form = new FormData(participantForm.current)

    const participant = {
      participant_id: governanceState.selectedParticipant.participant_id,
      did: form.get("did"),
      governance_id: governanceState.selectedParticipant.governance_id,
      name: form.get("name"),
      website: form.get("website"),
      email: form.get("email"),
      phone: form.get("phone"),
      roles: governanceState.selectedParticipant.roles
        ? governanceState.selectedParticipant.roles
        : [],
    }

    let array = JSON.parse(JSON.stringify(governanceState.participants)) // Creates a deep copy

    array = array.map((x) =>
      x.participant_id === participant.participant_id ? participant : x
    )

    dispatch(setSelectedGovernanceParticipant(participant))
    dispatch(setGovernanceParticipants(array))

    props.closeParticipantModal()
  }

  function closeModal() {
    props.closeParticipantModal()
  }

  return (
    <StyledPopup
      open={props.participantModalIsOpen}
      closeOnDocumentClick
      onClose={closeModal}
    >
      <LargeModal className="modal">
        <ModalHeader>Update Governance Participant</ModalHeader>
        <ModalContentWrapper>
          <ModalContent>
            <form id="form" onSubmit={handleSubmit} ref={participantForm}>
              <InputBox>
                <ModalLabel htmlFor="name">Name</ModalLabel>
                <InputFieldModal
                  type="text"
                  name="name"
                  id="name"
                  defaultValue={
                    governanceState.selectedParticipant
                      ? governanceState.selectedParticipant.name
                      : ""
                  }
                />
              </InputBox>
              <InputBox>
                <ModalLabel htmlFor="did">DID</ModalLabel>
                <InputFieldModal
                  type="text"
                  name="did"
                  id="did"
                  defaultValue={
                    governanceState.selectedParticipant
                      ? governanceState.selectedParticipant.did
                      : ""
                  }
                />
              </InputBox>
              <InputBox>
                <ModalLabel htmlFor="website">Website</ModalLabel>
                <InputFieldModal
                  type="text"
                  name="website"
                  id="website"
                  defaultValue={
                    governanceState.selectedParticipant
                      ? governanceState.selectedParticipant.website
                      : ""
                  }
                />
              </InputBox>
              <InputBox>
                <ModalLabel htmlFor="email">Email</ModalLabel>
                <InputFieldModal
                  type="text"
                  name="email"
                  id="email"
                  defaultValue={
                    governanceState.selectedParticipant
                      ? governanceState.selectedParticipant.email
                      : ""
                  }
                />
              </InputBox>
              <InputBox>
                <ModalLabel htmlFor="phone">Phone</ModalLabel>
                <InputFieldModal
                  type="text"
                  name="phone"
                  id="phone"
                  defaultValue={
                    governanceState.selectedParticipant
                      ? governanceState.selectedParticipant.phone
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

export default FormGovernanceParticipant
