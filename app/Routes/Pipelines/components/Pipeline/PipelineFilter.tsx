import React from "react"
import styled from "styled-components"
import classNames from "classnames"

const Wrapper = styled.div`
  display: flex;
  align-items: center;

  .filter-item {
    padding: 4px;
    cursor: pointer;
    color: white;
    background: ${(p) => p.theme.color.prim[400]};

    &.filter-item--active {
      background: ${(p) => p.theme.color.prim[500]};
    }
    :hover {
      opacity: 0.6;
    }
  }
`

export type FilterItem = {
  label: string
  value: string
}

export type PipelineFilterProps = {
  items: FilterItem[]
  value: FilterItem | null
  onChange: (status: FilterItem | null) => void
}

const PipelineFilter: React.FC<PipelineFilterProps> = (props) => {
  const { value, onChange, items } = props

  return (
    <Wrapper className="pipeline-filter">
      <button
        type="button"
        onClick={() => onChange(null)}
        className={classNames("filter-item", {
          "filter-item--active": value === null,
        })}
      >
        All
      </button>
      {items.map((item) => {
        return (
          <button
            type="button"
            onClick={() => onChange(item)}
            className={classNames("filter-item", {
              "filter-item--active": item.value === value?.value,
            })}
            key={item.value}
          >
            {item.label}
          </button>
        )
      })}
    </Wrapper>
  )
}

export default PipelineFilter
