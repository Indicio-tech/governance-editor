import React from "react";
import styled from "styled-components";

const Input = styled.input``;
const Form = styled.form`
  overflow: hidden;
  margin-bottom: 10px;
`;
const SubmitFormBtn = styled.button``;

function Governance(props) {
  return (
    <>
      <Form>
        <Input
          type="file"
          accept=".json"
          // onChange={logoSelectHandler}
        ></Input>
        <SubmitFormBtn type="submit">Upload</SubmitFormBtn>
      </Form>
    </>
  );
}

export default Governance;
