import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'

// A headline figure; one without a value is shown as a dash
export type TrialStat = { label: string, value?: string }

// The host is read from the trial's name, as the home page does for its silhouettes
const HOSTS = ['chicken', 'swine', 'turkey']
const getHost = (name: string) => HOSTS.find((host) => name.toLowerCase().includes(host))

// A trial in a list of them, laid out like the home page's 3dtk block: a tag naming
// the host, the trial's heading and four headline figures, and to the
// right a button to the trial's page, below them on narrower screens. Lists set
// the blocks apart with a margin of the page background
const TrialBlock = ({ fields, stats, to, browseLabel, aside, actions }: {
  fields: { ID: string, Name: string }
  stats: TrialStat[]
  // The trial's page, opened by its heading and the browse button
  to: string
  browseLabel: string
  // Set above the buttons, such as the catalogue's DOI
  aside?: ReactNode
  // Further buttons after the browse button
  actions?: ReactNode
}) => {
  const { ID, Name } = fields
  const host = getHost(Name)
  // "C - Proof-of-principle swine trial" is headed "Trial C — Proof-of-principle swine trial"
  const prefix = `${ID} - `
  const title = Name.startsWith(prefix) ? Name.slice(prefix.length) : null

  return <li className='px-8 py-7 flex justify-between gap-10 bg-surface_muted bg-texture max-lg:flex-col max-lg:gap-6 max-sm:px-4 max-sm:py-5'>
    <div className='flex-1 max-w-4xl'>
      {host &&
        <span className='inline-flex rounded-md border border-burgundy_ink/40 bg-burgundy_ink/10 px-2 py-1 font-jakarta text-xs leading-none text-burgundy_ink capitalize'>
          {host}
        </span>
      }
      <h2 className='main_header mt-3 mb-4 max-lg:text-xl'>
        <Link to={to} className='transition-colors hover:text-mustard'>
          {title
            ? <>Trial {ID} <span className='font-light text-ink_muted'>— {title}</span></>
            : Name
          }
        </Link>
      </h2>

      <dl className='grid grid-cols-4 gap-x-6 gap-y-3 max-sm:grid-cols-2'>
        {stats.map(({ label, value }) => (
          // A label that wraps onto a second line leaves the row's figures level
          <div key={label} className='flex flex-col justify-between'>
            <dt className='text-base uppercase tracking-wide text-ink_muted max-lg:text-sm'>{label}</dt>
            <dd className='main_header mt-1 text-burgundy_ink max-lg:text-xl'>{value ?? '—'}</dd>
          </div>
        ))}
      </dl>
    </div>

    <div className='flex flex-col justify-center gap-4 lg:w-80 max-lg:max-w-sm'>
      {aside}
      <div className='flex flex-wrap gap-3 [&_a]:inline-flex [&_a]:items-center [&_a]:gap-2 [&_a]:rounded-md [&_a]:border [&_a]:border-line [&_a]:bg-surface [&_a]:px-4 [&_a]:py-2 [&_a]:font-jakarta [&_a]:text-sm [&_a]:font-semibold hover:[&_a]:bg-surface_strong hover:[&_a]:text-mustard'>
        <Link to={to}>
          {browseLabel} <FontAwesomeIcon icon={faArrowRight} />
        </Link>
        {actions}
      </div>
    </div>
  </li>
}

export default TrialBlock
