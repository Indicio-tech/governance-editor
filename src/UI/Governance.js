import React, { useState } from "react"
import styled from "styled-components"

const Input = styled.input``
const Form = styled.form`
  overflow: hidden;
  margin-bottom: 10px;
`
const SubmitFormBtn = styled.button``

function Governance(props) {
  const [selectedGovernance, setSelectedGovernance] = useState("trash")
  // const [governanceFileName, setGovernanceFileName] = useState("Choose file");

  let governanceSelectHandler = (event) => {
    const file = event.target.files[0]

    if (file) {
      const fileReader = new FileReader()
      fileReader.readAsText(event.target.files[0], "UTF-8")
      fileReader.onload = (e) => {
        // console.log("e.target.result", e.target.result);
        setSelectedGovernance(e.target.result)
      }

      // setGovernanceFileName(event.target.files[0].name);
    }
  }

  const handleLogoSubmit = async (e) => {
    e.preventDefault()

    console.log(selectedGovernance)
    if (selectedGovernance) {
    } else {
    }
  }

  return (
    <>
      <Form onSubmit={handleLogoSubmit}>
        <Input
          type="file"
          accept=".json"
          onChange={governanceSelectHandler}
        ></Input>
        <SubmitFormBtn type="submit">Upload</SubmitFormBtn>
      </Form>
    </>
  )
}

export default Governance
