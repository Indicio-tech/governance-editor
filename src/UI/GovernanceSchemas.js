import React, { useRef } from "react"
import { useSelector, useDispatch } from "react-redux"
import styled from "styled-components"

import { setNotificationState } from "../redux/notificationsReducer"

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

const Flexbox = styled.div`
  display: flex;
  justify-content: center;
  width: 75%;
  color: blue;

  :hover {
    cursor: pointer;
    background: #ffc;
  }
`

const SchemaWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 75%;
`

const FloatRight = styled.div`
  // float: right;
  text-align: right;
  padding-right: 30px;
  flex: 1;
`

const FloatLeft = styled.div`
  // float: left;
  text-align: left;
  padding-left: 30px;
  flex: 1;
`

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

// const H3 = styled.h3`
//   margin: 5px 0;
// `

// const Form = styled.form`
//   overflow: hidden;
//   margin-bottom: 10px;
// `
const SaveBtn = styled.button`
  width: 80px;
  background: ${(props) => props.theme.primary_color};
  padding: 10px;
  color: ${(props) => props.theme.text_light};
  border: none;
  float: right;
  box-shadow: ${(props) => props.theme.drop_shadow};
`

// const SubmitFormBtn = styled.button``

// const BlockInput = styled.input`
//   display: block;
//   margin-bottom: 15px;
// `

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

function GovernanceSchemas(props) {
  const dispatch = useDispatch()
  const governanceState = useSelector((state) => state.governance)
  // const [schemasByGovernance, setSchemasByGovernance] = useState([])

  // (eldersonar) Get schemas that are related to selected governance (metadata) only
  // useEffect(() => {
  //   if (governanceState.selectedGovernance && governanceState.schemas) {
  //     const schemas = governanceState.schemas.filter(
  //       (schema) =>
  //         schema.governance_id === governanceState.selectedGovernance.id
  //     )
  //     console.log(schemas)
  //     setSchemasByGovernance(schemas)
  //   }
  // }, [governanceState.schemas, governanceState.selectedGovernance])

  const newSchemaForm = useRef()
  const history = props.history

  const openSchema = (history, schema_id) => {
    if (history !== undefined) {
      history.push("/admin/governance/schemas/" + schema_id)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const form = new FormData(newSchemaForm.current)
    const id = form.get("id")
    const name = form.get("name")
    const suffix = "_issuer"

    let role = id.split(":")[2] + "_v" + id.split(":")[3]
    role = role.concat(suffix).toLowerCase()

    if (governanceState.selectedGovernance.id) {
      const schema = {
        schema_id: "",
        id,
        governance_id: governanceState.selectedGovernance.id,
        name,
        issuer_roles: [role],
      }

      // Save new schema
      props.sendRequest("GOVERNANCE", "SET_SCHEMA", schema)

      // Save new role
      props.sendRequest("GOVERNANCE", "SET_ROLE", {
        governance_id: governanceState.selectedGovernance.id,
        role: role,
        credentials: [],
      })

      newSchemaForm.current.reset()

      // (eldersonar) TODO: Need a better way to update the state
      // (eldersonar) Wait 0.5 sec for the database to update and fetch fresh set of data
      setTimeout(() => {
        props.sendRequest("GOVERNANCE", "GET_ALL_SCHEMAS", {})
        props.sendRequest("GOVERNANCE", "GET_ALL_ROLES", {})
      }, 500)
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
      <PageHeader title="Schemas" />
      <PageSection>
        <GovernanceHeader>Schema List</GovernanceHeader>
        <Wrapper>
          <SchemaWrapper>
            <FloatRight>Schema name</FloatRight>
            <FloatLeft>Schema ID</FloatLeft>
          </SchemaWrapper>
          {governanceState.schemas.map((schema) => (
            <Flexbox
              key={schema.id}
              onClick={() => {
                openSchema(history, schema.schema_id)
              }}
            >
              <FloatRight>{schema.name}</FloatRight>
              <FloatLeft>{schema.id}</FloatLeft>
            </Flexbox>
          ))}
        </Wrapper>
      </PageSection>
      <PageSection>
        <GovernanceHeader>Add Schema</GovernanceHeader>
        <form id="form" onSubmit={handleSubmit} ref={newSchemaForm}>
          <InputBox>
            <ModalLabel htmlFor="name">Schema ID</ModalLabel>
            <Input
              type="text"
              name="id"
              id="id"
              placeholder="4CLG5pU5v294VdkMWxSByu:2:Email:1.0"
            />
          </InputBox>
          <InputBox>
            <ModalLabel htmlFor="name">Schema Name</ModalLabel>
            <Input
              type="text"
              name="name"
              id="name"
              placeholder="Validated Email"
            />
          </InputBox>
          <SaveBtn type="submit">Add</SaveBtn>
        </form>
      </PageSection>
    </>
  )
}

export default GovernanceSchemas
