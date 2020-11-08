import React from "react"

export type SectionProps = {
  section: any
  onDeleteSection: (section: any) => void
  editMode?: boolean
}

const Section: React.FC<SectionProps> = (props) => {
  const { section, editMode, children, onDeleteSection } = props

  return (
    <div className="section" key={section.id}>
      <h2 className="section-label">
        <span>
          <span role="img">{section.icon}</span>
          {section.label}
        </span>
        {editMode && (
          <button
            type="button"
            className="delete-button"
            onClick={() => onDeleteSection(section)}
          >
            🗑
          </button>
        )}
      </h2>
      <ul>{children}</ul>
    </div>
  )
}

export default Section
