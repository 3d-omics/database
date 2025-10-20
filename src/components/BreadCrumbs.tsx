import { Link } from 'react-router-dom'

const BreadCrumbs = ({ items }: {
  items: { label: string, link?: string }[]
}) => {
  return (
    <div className='breadcrumbs text-[12.5px] mb-3' data-testid='breadcrumbs'>
      <ul className=''>
        {items.map((item) => (
          <li key={item.label}>
            {item.link
              ? <Link to={item.link}>{item.label}</Link>
              : <span className='font-semibold'>{item.label}</span>
            }
          </li>
        ))}
      </ul>
    </div>
  )
}

export default BreadCrumbs