import React, { useRef, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"

import {
  setSelectedGovernanceIssuer,
  setGovernanceIssuers,
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

function FormGovernanceIssuer(props) {
  const dispatch = useDispatch()
  const governanceState = useSelector((state) => state.governance)
  const error = props.error

  const issuerForm = useRef()
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

    const form = new FormData(issuerForm.current)

    const issuer = {
      issuer_id: governanceState.selectedIssuer.issuer_id,
      did: form.get("did"),
      governance_id: governanceState.selectedIssuer.governance_id,
      name: form.get("name"),
      website: form.get("website"),
      email: form.get("email"),
      phone: form.get("phone"),
      address: form.get("address"),
      city: form.get("city"),
      zip: form.get("zip"),
      state: form.get("state"),
      roles: governanceState.selectedIssuer.issuer_roles
        ? governanceState.selectedIssuer.issuer_roles
        : [],
    }

    let array = JSON.parse(JSON.stringify(governanceState.issuers)) // Creates a deep copy

    array = array.map((x) => (x.issuer_id === issuer.issuer_id ? issuer : x))

    dispatch(setSelectedGovernanceIssuer(issuer))
    dispatch(setGovernanceIssuers(array))

    props.closeIssuerModal()
  }

  function closeModal() {
    props.closeIssuerModal()
  }

  return (
    <StyledPopup
      open={props.issuerModalIsOpen}
      closeOnDocumentClick
      onClose={closeModal}
    >
      <LargeModal className="modal">
        <ModalHeader>Update Governance Issuer</ModalHeader>
        <ModalContentWrapper>
          <ModalContent>
            <form id="form" onSubmit={handleSubmit} ref={issuerForm}>
              <InputBox>
                <ModalLabel htmlFor="name">Name</ModalLabel>
                <InputFieldModal
                  type="text"
                  name="name"
                  id="name"
                  defaultValue={
                    governanceState.selectedIssuer
                      ? governanceState.selectedIssuer.name
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
                    governanceState.selectedIssuer
                      ? governanceState.selectedIssuer.did
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
                    governanceState.selectedIssuer
                      ? governanceState.selectedIssuer.website
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
                    governanceState.selectedIssuer
                      ? governanceState.selectedIssuer.email
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
                    governanceState.selectedIssuer
                      ? governanceState.selectedIssuer.phone
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
                    governanceState.selectedIssuer
                      ? governanceState.selectedIssuer.address
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
                    governanceState.selectedIssuer
                      ? governanceState.selectedIssuer.city
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
                    governanceState.selectedIssuer
                      ? governanceState.selectedIssuer.zip
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
                    governanceState.selectedIssuer
                      ? governanceState.selectedIssuer.state
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

export default FormGovernanceIssuer
