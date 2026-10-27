import React from "react"
import { NavLink } from "react-router-dom"
import styled from "styled-components"

const List = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  & ul {
    // display: none;
    position: relative;
    padding: 0 0 0 20px;
  }
`
const Item = styled.li`
  border-bottom: 1px solid ${(props) => props.theme.border};
  &:first-child {
    border-top: 1px solid ${(props) => props.theme.border};
  }
  & li,
  & li:first-child {
    border: none;
  }
  & a.active {
    border-right: 3px solid ${(props) => props.theme.primary_color};
    background: ${(props) => props.theme.text_light};
    color: ${(props) => props.theme.primary_color};
  }
  &.active ul {
    display: block;
  }
`
const StyledLink = styled(NavLink)`
  display: block;
  padding: 20px 0 20px 20px;
  font-size: 16px;
  font-weight: bold;
  text-decoration: none;
  text-transform: uppercase;
  color: ${(props) => props.theme.text_color};
  &:hover,
  &.active {
    text-decoration: underline;
    color: ${(props) => props.theme.secondary_color};
    border-right: 3px solid ${(props) => props.theme.secondary_color};
    background: ${(props) => props.theme.background_secondary};
  }
`
const StyledSubLink = styled(NavLink)`
  display: block;
  padding: 10px 0 10px 20px;
  font-size: 14px;
  text-decoration: none;
  color: ${(props) => props.theme.text_color};
  &:hover,
  &.active {
    text-decoration: underline;
    color: ${(props) => props.theme.primary_color};
    background: none;
  }
`
function AppMenu(props) {
  let pathMatch = ""
  if (props.match.path !== undefined) {
    pathMatch = props.match.path
  }
  return (
    <nav id="app-menu">
      <List>
        <Item className={pathMatch === "/governance" ? "active" : undefined}>
          <StyledLink exact to="/governance">
            Governance
          </StyledLink>
        </Item>
        <List>
          <Item
            className={
              pathMatch === "/governance/schemas" ? "active" : undefined
            }
          >
            <StyledSubLink exact to="/governance/schemas">
              Schemas
            </StyledSubLink>
          </Item>
          <Item
            className={
              pathMatch === "/governance/participants" ? "active" : undefined
            }
          >
            <StyledSubLink exact to="/governance/participants">
              Participants
            </StyledSubLink>
          </Item>
        </List>
      </List>
    </nav>
  )
}
export default AppMenu
