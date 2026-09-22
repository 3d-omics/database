import { useState, useEffect } from 'react'

const TAXONOMIC_LEVELS = ['phylum', 'class', 'order']

// Chooses the level the chart and legend are drawn at: a row of buttons, or a
// dropdown on screens too narrow to hold them
const TaxonomicLevelPicker = ({ selectedTaxonomicLevel, onChange, disabled = false }: {
  selectedTaxonomicLevel: string
  onChange: (level: string) => void
  disabled?: boolean
}) => {

  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className='flex items-center'>
      <p className='text-sm font-bold mr-1.5 whitespace-nowrap'>Taxonomic Level:</p>
      <div>
        {windowWidth >= 640 ? (
          TAXONOMIC_LEVELS.map((level) => (
            <button
              key={level}
              onClick={() => onChange(level)}
              disabled={disabled}
              className={`btn btn-xs border-none mr-1 ${selectedTaxonomicLevel === level && 'bg-light_burgundy text-white'
                } ${disabled && 'opacity-50 cursor-not-allowed'}`}
            >
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </button>
          ))
        ) : (
          <select
            value={selectedTaxonomicLevel}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className='btn btn-xs bg-surface_strong border-none outline-none'
          >
            {TAXONOMIC_LEVELS.map((level) => (
              <option value={level} key={level}>{level}</option>
            ))}
          </select>
        )}
      </div>
    </div>
  )
}

export default TaxonomicLevelPicker
