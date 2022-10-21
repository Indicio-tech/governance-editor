import React, { useRef, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"

import {
  setSelectedGovernanceIssuer,
  setGovernanceIssuers,
} from "../redux/governanceReducer"

import {
  Actions,
  CancelBtn,
  //   Checkbox,
  //   CheckboxHolder,
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
    const name = form.get("name")
    const did = form.get("did")
    const website = form.get("website")
    const email = form.get("email")
    const phone = form.get("phone")

    const issuer = {
      issuer_id: governanceState.selectedIssuer.issuer_id,
      did,
      governance_id: governanceState.selectedIssuer.governance_id,
      name,
      website,
      email,
      phone,
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
    // setOptions([])
    props.closeIssuerModal()
  }

  //   const handleCheckboxChange = (event) => {
  //     let newArray = [...options, event.target.value]
  //     if (options.includes(event.target.value)) {
  //       newArray = newArray.filter((s) => s !== event.target.value)
  //     }
  //     setOptions(newArray)
  //   }

  //   const rolesOptions = roles.map((role) => {
  //     return (
  //       <div key={role.role_id}>
  //         <Checkbox
  //           type="checkbox"
  //           value={role.role_id}
  //           id={role.role_id}
  //           onChange={handleCheckboxChange}
  //         />
  //         <label htmlFor={role.role_id}>{role.role_name}</label>
  //       </div>
  //     )
  //   })

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
