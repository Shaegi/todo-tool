import React from "react"
import styled from "styled-components"

const Wrapper = styled.div<SidebarAddItemProps>`
  background: ${(p) => p.theme.color.green[p.active ? 400 : 500]};
  width: 100%;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
`

export type SidebarAddItemProps = {
  active?: boolean
}

const SidebarAddItem: React.FC<SidebarAddItemProps> = ({ active }) => {
  return (
    <Wrapper className="sidebar-add-item" active={active}>
      <span>+</span>
    </Wrapper>
  )
}

export default SidebarAddItem
