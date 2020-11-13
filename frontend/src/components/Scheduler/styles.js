import styled from 'styled-components'

export const Photo = styled.div `
  margin: 8px;
  position: relative;
`

export const Close = styled.button `
  width: 24px;
  height: 24px;
  line-height: 8px;
  border-radius: 12px;
  position: absolute;
  top: 8px;
  right: 4px;
  box-shadow: 1px 2px #888888;
  &:hover {
    background-color: lightgray;
    cursor: pointer;
  }
`