import React from "react"
import styled from "styled-components"

import AppMenu from "./AppMenu.js"
import PoweredByImage from "../assets/powered-by.png"

import { PoweredHolder, PoweredBy } from "./CommonStylesForms"

const Header = styled.header`
  flex: 3;
  min-width: 240px;
  max-width: 240px;
  min-height: 100vh;
  background: ${(props) => props.theme.background_primary};
  position: relative;
`

function AppHeader(props) {
  return (
    <Header id="app-header">
      <AppMenu match={props.match} />
      <PoweredHolder>
        <PoweredBy src={PoweredByImage} alt="Powered By Indicio" />
      </PoweredHolder>
    </Header>
  )
}

export default AppHeader
