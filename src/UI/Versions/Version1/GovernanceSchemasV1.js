import React, { useRef } from "react"
import { useSelector, useDispatch } from "react-redux"
import styled from "styled-components"

import {
  setGovernanceSchemas,
  setGovernanceRoles,
} from "../../../redux/governanceReducer"
import { setNotificationState } from "../../../redux/notificationsReducer"

import { getNextId } from "../../utils"

import PageHeader from "../../Core/PageHeader.js"
import PageSection from "../../Core/PageSection.js"

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

function GovernanceSchemas(props) {
  const dispatch = useDispatch()
  const governanceState = useSelector((state) => state.governance)
  const newSchemaForm = useRef()
  const history = props.history

  const openSchema = (history, schema_id) => {
    if (history !== undefined) {
      history.push("/governance/schemas/" + schema_id)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const form = new FormData(newSchemaForm.current)
    const id = form.get("id")
    const suffix = "_issuer"

    let roleName = id.split(":")[2] + "_v" + id.split(":")[3]
    roleName = roleName.concat(suffix).toLowerCase()

    if (governanceState.selectedGovernance.id) {
      const schema = {
        schema_id: getNextId(governanceState.schemas, "schema_id"),
        id,
        governance_id: governanceState.selectedGovernance.id,
        name: form.get("name"),
        issuer_roles: [roleName],
      }

      const role = {
        role_id: getNextId(governanceState.roles, "role_id"),
        governance_id: governanceState.selectedGovernance.id,
        role: roleName,
        credentials: [],
      }

      // Save new schema
      dispatch(setGovernanceSchemas([...governanceState.schemas, schema]))
      // Save new role
      dispatch(setGovernanceRoles([...governanceState.roles, role]))

      newSchemaForm.current.reset()
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
              key={schema.schema_id}
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
