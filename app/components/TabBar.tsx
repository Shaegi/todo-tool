/* eslint-disable @typescript-eslint/no-unused-expressions */
import React, { useMemo, useState } from "react"
import styled from "styled-components"
import Sidebar, { SideBarItem } from "./Sidebar"

const Wrapper = styled.div`
  display: flex;
`

export type TabBarItem = Omit<SideBarItem, "active"> & {
  ContentRenderer: React.ReactNode
}

type TabBarProps = {
  items: TabBarItem[]
  initialActiveIndex?: number
}

const TabBar: React.FC<TabBarProps> = (props) => {
  const { initialActiveIndex = 0, items } = props
  const [active, setActive] = useState<number>(initialActiveIndex)

  const resolvedItems = useMemo(() => {
    return items.map((i, index) => ({
      ...i,
      active: index === active,
      onClick: (e: React.MouseEvent) => {
        setActive(index)
        i.onClick && i.onClick(e)
      },
    }))
  }, [items, active])

  const activeItem = resolvedItems.find((i) => i.active)

  console.log(activeItem)

  return (
    <Wrapper>
      <Sidebar items={resolvedItems} />
      <>{activeItem && activeItem.ContentRenderer}</>
    </Wrapper>
  )
}

export default TabBar
