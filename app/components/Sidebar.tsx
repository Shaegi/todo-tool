import React from "react"
import styled from "styled-components"

const StyledSidebar = styled.nav`
  width: 100px;
  height: 100%;
`

type SidebarItemProps = {
  active?: boolean
}

const SidebarItem = styled.li<SidebarItemProps>`
  a,
  div {
    cursor: pointer;
    color: white;
    text-decoration: none;
    > div {
      background: ${(p) =>
        p.active ? p.theme.color.prim[500] : p.theme.color.prim[300]};
      height: 100px;
      width: 100px;
      text-align: center;
      justify-content: center;
      text-align: center;
      display: flex;
      align-items: center;
    }
  }
`

export type SideBarItem = {
  active?: boolean
  key: string
  Renderer: React.ReactNode
}

export type SideBarProps = {
  items: SideBarItem[]
}

const Sidebar: React.FC<SideBarProps> = ({ items }) => {
  return (
    <StyledSidebar>
      <ul>
        {items.map(({ key, active, Renderer }) => {
          return (
            <SidebarItem key={key} active={active}>
              {Renderer}
            </SidebarItem>
          )
        })}
      </ul>
    </StyledSidebar>
  )
}

export default Sidebar
