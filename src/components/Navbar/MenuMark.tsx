// The site's triangle mark, as between the breadcrumbs and before the Methods
// headings: it points at the page that is open and slides in on the link hovered
const MenuMark = ({ active }: { active: boolean }) => (
  <span
    aria-hidden='true'
    className={`w-1.5 h-[7px] shrink-0 clip-triangle bg-gradient-to-b from-mustard to-burgundy_ink transition duration-200 motion-reduce:transition-none ${active ? '' : 'opacity-0 -translate-x-1 group-hover/sub:opacity-100 group-hover/sub:translate-x-0 group-focus-visible/sub:opacity-100 group-focus-visible/sub:translate-x-0'}`}
  />
)

export default MenuMark
