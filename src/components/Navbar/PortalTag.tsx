import { NavLink } from 'react-router-dom'

// The link to the portal's home page, set beside the 3D'omics logo as a tag
// naming the part of the 3D'omics site that is open rather than as a menu entry.
// It fills with burgundy on the home page, as the menu marks the page that is open
const PortalTag = ({ onClick, className = '' }: { onClick?: () => void, className?: string }) => (
  <NavLink
    to='/'
    end
    onClick={onClick}
    className={({ isActive }) => `inline-flex shrink-0 items-center self-center rounded-md border px-2 py-1 font-jakarta text-xs font-bold leading-none whitespace-nowrap outline-none transition-colors duration-200 motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-burgundy_ink/40 max-sm:px-1.5 max-sm:text-2xs ${isActive
      ? 'border-burgundy_ink/40 bg-burgundy_ink/10 text-burgundy_ink'
      : 'border-line_strong text-ink_muted hover:border-burgundy_ink/40 hover:text-burgundy_ink focus-visible:border-burgundy_ink/40 focus-visible:text-burgundy_ink'} ${className}`}
  >
    Data portal
  </NavLink>
)

export default PortalTag
