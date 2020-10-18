/* eslint-disable @typescript-eslint/no-unused-expressions */
import React, {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useState,
} from "react"
import styled from "styled-components"
import Sidebar, { SideBarItem } from "./Sidebar"

const Wrapper = styled.div`
  display: flex;
  width: 100%;
`

export type TabBarRef = { setIndex: (index: number) => void }

export type TabBarItem = Omit<SideBarItem, "active"> & {
  ContentRenderer: React.ReactNode
}

type TabBarProps = {
  items: TabBarItem[]
  initialActiveIndex?: number
}

const TabBar = forwardRef<TabBarRef, TabBarProps>((props, ref) => {
  const { initialActiveIndex = 0, items } = props
  const [active, setActive] = useState<number>(initialActiveIndex)

  useImperativeHandle(ref, () => ({
    setIndex: setActive,
  }))

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

  return (
    <Wrapper>
      <Sidebar items={resolvedItems} />
      <>{activeItem && activeItem.ContentRenderer}</>
    </Wrapper>
  )
})

export default TabBar
