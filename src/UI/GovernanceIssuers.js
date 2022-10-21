import React, { useRef } from "react"
import { useSelector, useDispatch } from "react-redux"
import styled from "styled-components"

import { setGovernanceIssuers } from "../redux/governanceReducer"
import { setNotificationState } from "../redux/notificationsReducer"

import { getNextId } from "./utils"

// import { CanUser } from './CanUser'
// import GovernanceMetadataEdit from './GovernanceMetadataEdit'

import PageHeader from "./PageHeader.js"
import PageSection from "./PageSection.js"

// import {
//   DataTable,
//   DataRow,
//   DataHeader,
//   DataCell,
//   AttributeTable,
//   AttributeRow,
//   IconCell,
//   IconClose,
//   IconCheck,
// } from './CommonStylesTables'

// import { ModalLabel } from './CommonStylesForms'

const Wrapper = styled.div``

const IssuersHolder = styled.div`
  display: flex;
  justify-content: center;
  width: 75%;
  color: blue;

  :hover {
    cursor: pointer;
    background: #ffc;
  }
`

// const SchemaWrapper = styled.div`
//   display: flex;
//   justify-content: center;
//   width: 75%;
// `

// const FloatRight = styled.div`
//   // float: right;
//   text-align: right;
//   padding-right: 30px;
//   flex: 1;
// `

// const FloatLeft = styled.div`
//   // float: left;
//   text-align: left;
//   padding-left: 30px;
//   flex: 1;
// `

// const SchemaHolder = styled.div`
//   margin: 10px;
// `

const InputBox = styled.div`
  margin: 10px;
  //   display: flex;
  //   justify-content: center;
`
const ModalLabel = styled.label`
  color: ${(props) => props.theme.text_color};
  //   font-size: 1.5em;
  //   width: 30%;
  margin-right: 10px;
`

const Input = styled.input`
  width: 300px;
`
const SaveBtn = styled.button`
  width: 80px;
  background: ${(props) => props.theme.primary_color};
  padding: 10px;
  color: ${(props) => props.theme.text_light};
  border: none;
  float: right;
  box-shadow: ${(props) => props.theme.drop_shadow};
`
const GovernanceHeader = styled.h3`
  display: inline-block;
  margin-right: 10px;
  margin-bottom: 0;
`
// import {
//   Button,
//   SubmitBtnModal,
//   Modal,
//   Actions,
//   Select,
// } from './CommonStylesForms'

// const HomeHeader = styled.h2`
//   display: inline-block;
//   margin-right: 10px;
//   font-size: 1.3em;
// `

function GovernanceIssuers(props) {
  const dispatch = useDispatch()
  const governanceState = useSelector((state) => state.governance)
  // const [issuersByGovernance, setIssuersByGovernance] = useState([])

  // (eldersonar) Get schemas that are related to selected governance (metadata) only
  // useEffect(() => {
  //   if (governanceState.selectedGovernance && governanceState.issuers) {
  //     const issuers = governanceState.issuers.filter(
  //       (schema) =>
  //         schema.governance_id === governanceState.selectedGovernance.id
  //     )
  //     console.log(issuers)
  //     setIssuersByGovernance(issuers)
  //   }
  // }, [governanceState.issuers, governanceState.selectedGovernance])

  const newIssuerForm = useRef()
  const history = props.history

  const openIssuer = (history, id) => {
    if (history !== undefined) {
      history.push("/governance/issuers/" + id)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const form = new FormData(newIssuerForm.current)
    const name = form.get("name")

    if (governanceState.selectedGovernance.id) {
      // (eldersonar) Check for the name. Must be unique
      const issuer = {
        issuer_id: getNextId(governanceState.issuers, "issuer_id"),
        did: "",
        governance_id: governanceState.selectedGovernance.id,
        name,
        website: "",
        email: "",
        phone: "",
        roles: [],
      }

      // props.sendRequest("GOVERNANCE", "SET_ISSUER", issuer)
      dispatch(setGovernanceIssuers([...governanceState.issuers, issuer]))

      newIssuerForm.current.reset()

      // (eldersonar) TODO: Need a better way to update the state
      // (eldersonar) Wait 0.5 sec for the database to update and fetch fresh set of data
      // setTimeout(() => {
      //   props.sendRequest("GOVERNANCE", "GET_ALL_ISSUERS", {})
      // }, 500)
    } else {
      dispatch(
        setNotificationState({
          message:
            "The governance (governance metadata) must be selected first",
          type: "error",
        })
      )
    }
  }

  return (
    <>
      <PageHeader title="Issuers" />
      <PageSection>
        <GovernanceHeader>Issuers List</GovernanceHeader>
        <Wrapper>
          {governanceState.issuers.map((issuer) => (
            <IssuersHolder
              key={issuer.issuer_id}
              onClick={() => {
                openIssuer(history, issuer.issuer_id)
              }}
            >
              <div>{issuer.name}</div>
            </IssuersHolder>
          ))}
        </Wrapper>
      </PageSection>
      <PageSection>
        <GovernanceHeader>Add Issuer</GovernanceHeader>
        <form id="form" onSubmit={handleSubmit} ref={newIssuerForm}>
          <InputBox>
            <ModalLabel htmlFor="name">Issuer Name</ModalLabel>
            <Input
              type="text"
              name="name"
              id="name"
              placeholder="Doctor's office"
            />
          </InputBox>
          <SaveBtn type="submit">Add</SaveBtn>
        </form>
      </PageSection>
    </>
  )
}

export default GovernanceIssuers
