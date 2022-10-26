import styled from "styled-components"

export const DataTable = styled.table`
  box-sizing: content-box;
  margin-top: -16px;
  margin-left: -25px;
  width: calc(100% + 50px);
  border-collapse: collapse;
`
export const DataRow = styled.tr`
  :nth-child(2n + 2) td {
    background: ${(props) => props.theme.background_secondary};
  }

  :hover td {
    cursor: pointer;
    background: #ffc;
  }
`
export const DataHeader = styled.th`
  padding: 8px 12px;
  text-align: left;
  border-bottom: 1px solid ${(props) => props.theme.primary_color};
`
export const DataCell = styled.td`
  padding: 8px 12px;
  text-align: left;
`
export const AttributeTable = styled.table`
  margin-bottom: 1em;
  border-collapse: collapse;
`
export const AttributeRow = styled.tr`
  th {
    padding: 0 6px;
    text-align: left;
  }
`
export const IconCell = styled.td`
  color: ${(props) => props.theme.primary_color};
  box-shadow: none;
  text-align: center;
  font-size: 1.2em;
  :hover {
    cursor: pointer;
  }
`
