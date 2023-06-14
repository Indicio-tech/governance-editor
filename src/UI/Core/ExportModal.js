import React, { useRef, useState, useEffect } from "react"

import {
  StyledPopup,
  Modal,
  ModalHeader,
  ModalContentWrapper,
  ModalContent,
  CloseBtn,
  Actions,
  SubmitBtnModal,
} from "../Styles/CommonStylesForms"

function FormFileExport(props) {
  const error = props.error

  const [selectedOption, setSelectedOption] = useState("")

  const submitBtn = useRef()

  useEffect(() => {
    if (error && submitBtn.current) {
      submitBtn.current.removeAttribute("disabled")
    }
  }, [error])

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Exporting via ", selectedOption)
    if (selectedOption === "API") {
      props.exportGovernanceFile()
    }
  }

  function closeModal() {
    props.closeGovernanceExportModal()
  }

  return (
    <StyledPopup
      open={props.governanceExportModalIsOpen}
      closeOnDocumentClick
      onClose={closeModal}
    >
      <Modal className="modal">
        <ModalHeader>Choose one from the available export options</ModalHeader>
        <ModalContentWrapper>
          <ModalContent>
            <form id="form" onSubmit={handleSubmit}>
              <Actions>
                {props.publishOptions.map((option) => (
                  <SubmitBtnModal
                    key={option}
                    type="submit"
                    onClick={() => setSelectedOption(option)}
                    className={selectedOption === option ? "active" : ""}
                  >
                    {option}
                  </SubmitBtnModal>
                ))}
              </Actions>
            </form>
          </ModalContent>
        </ModalContentWrapper>
        <CloseBtn onClick={closeModal}>&times;</CloseBtn>
      </Modal>
    </StyledPopup>
  )
}

export default FormFileExport
