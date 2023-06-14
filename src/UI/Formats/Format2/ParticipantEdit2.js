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

    const issuer = {
      participant_id: governanceState.selectedParticipant.participant_id,
      did: form.get("did"),
      governance_id: governanceState.selectedParticipant.governance_id,
      name: form.get("name"),
      website: form.get("website"),
      email: form.get("email"),
      phone: form.get("phone"),
      address: form.get("address"),
      city: form.get("city"),
      zip: form.get("zip"),
      state: form.get("state"),
      roles: governanceState.selectedParticipant.roles
        ? governanceState.selectedParticipant.roles
        : [],
    }

    let array = JSON.parse(JSON.stringify(governanceState.participants)) // Creates a deep copy

    array = array.map((x) =>
      x.participant_id === issuer.participant_id ? issuer : x
    )

    dispatch(setSelectedGovernanceParticipant(issuer))
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
              <InputBox>
                <ModalLabel htmlFor="address">Address</ModalLabel>
                <InputFieldModal
                  type="text"
                  name="address"
                  id="address"
                  defaultValue={
                    governanceState.selectedParticipant
                      ? governanceState.selectedParticipant.address
                      : ""
                  }
                />
              </InputBox>
              <InputBox>
                <ModalLabel htmlFor="city">City</ModalLabel>
                <InputFieldModal
                  type="text"
                  name="city"
                  id="city"
                  defaultValue={
                    governanceState.selectedParticipant
                      ? governanceState.selectedParticipant.city
                      : ""
                  }
                />
              </InputBox>
              <InputBox>
                <ModalLabel htmlFor="zip">Zip</ModalLabel>
                <InputFieldModal
                  type="text"
                  name="zip"
                  id="zip"
                  defaultValue={
                    governanceState.selectedParticipant
                      ? governanceState.selectedParticipant.zip
                      : ""
                  }
                />
              </InputBox>
              <InputBox>
                <ModalLabel htmlFor="state">State</ModalLabel>
                <InputFieldModal
                  type="text"
                  name="state"
                  id="state"
                  defaultValue={
                    governanceState.selectedParticipant
                      ? governanceState.selectedParticipant.state
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
