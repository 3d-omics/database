import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import PageHeader from 'components/PageHeader'
import NotFound from 'pages/NotFound'
import { methods, type Reference } from './methodsContent'

const sections = [
  { key: 'laboratory', heading: 'Laboratory processing' },
  { key: 'bioinformatics', heading: 'Bioinformatic processing' },
] as const

// How long a reference stays highlighted after jumping to it from the text
const HIGHLIGHT_MS = 2500

const referenceId = (index: number) => `ref-${index + 1}`

const escapeRegExp = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

// Section heading marked with a triangle in the mustard-to-burgundy gradient
// of the site's prism banner
const SectionHeading = ({ children }: { children: string }) => (
  <h2 className='main_header text-xl text-burgundy flex items-center gap-3 pb-2 mb-4 border-b border-neutral-200'>
    <span aria-hidden='true' className='w-3 h-3.5 shrink-0 clip-triangle bg-gradient-to-b from-mustard to-burgundy' />
    {children}
  </h2>
)

// A paragraph whose in-text citations link to their entry in the reference list
const CitedParagraph = ({ text, references, onCite, className }: {
  text: string
  references: Reference[]
  onCite: (event: MouseEvent<HTMLAnchorElement>, id: string) => void
  className?: string
}) => {
  const citations = references.map((reference) => reference.cite)
  // Longest first, so a citation containing a shorter one is matched whole
  const pattern = citations.length > 0
    ? new RegExp(`(${[...citations].sort((a, b) => b.length - a.length).map(escapeRegExp).join('|')})`)
    : null

  return (
    <p className={className}>
      {(pattern ? text.split(pattern) : [text]).map((part, index) => {
        const referenceIndex = citations.indexOf(part)
        if (referenceIndex === -1) return part
        const id = referenceId(referenceIndex)
        return (
          <a
            key={index}
            href={`#${id}`}
            onClick={(event) => onCite(event, id)}
            className='underline decoration-dotted underline-offset-2 hover:text-mustard'
          >
            {part}
          </a>
        )
      })}
    </p>
  )
}

const Methods = () => {

  const { methodName } = useParams()
  const method = methods.find((m) => m.slug === methodName)

  // The reference last jumped to from an in-text citation, highlighted briefly
  const [highlighted, setHighlighted] = useState<string | null>(null)
  const highlightTimer = useRef<number | undefined>(undefined)
  useEffect(() => () => window.clearTimeout(highlightTimer.current), [])

  if (!method) return <NotFound />

  const showReference = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault()
    const reference = document.getElementById(id)
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    reference?.scrollIntoView?.({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' })
    reference?.focus({ preventScroll: true })
    setHighlighted(id)
    window.clearTimeout(highlightTimer.current)
    highlightTimer.current = window.setTimeout(() => setHighlighted(null), HIGHLIGHT_MS)
  }

  return (
    <div className='min-h-[calc(100dvh-(var(--navbar-height)+var(--footer-height)))]'>
      <PageHeader
        title={method.title}
        breadcrumbs={[
          { label: 'Data Portal Home', link: '/' },
          { label: 'Methods' },
          { label: method.title },
        ]}
      >
        {method.intro.map((paragraph, index) => (
          <CitedParagraph
            key={index}
            text={paragraph}
            references={method.references}
            onCite={showReference}
          />
        ))}
      </PageHeader>

      <div className='page_padding max-w-4xl text-sm leading-relaxed text-custom_black'>
        {sections.map(({ key, heading }) => (
          <section key={key} className='mb-10'>
            <SectionHeading>{heading}</SectionHeading>
            {method[key].length > 0
              ? method[key].map((paragraph, index) => (
                <CitedParagraph
                  key={index}
                  text={paragraph}
                  references={method.references}
                  onCite={showReference}
                  className='mb-3'
                />
              ))
              : <p className='italic text-neutral-500'>This section is in preparation.</p>
            }
          </section>
        ))}

        {method.references.length > 0 && (
          <section className='mb-10'>
            <SectionHeading>References</SectionHeading>
            <ul className='text-xs'>
              {method.references.map(({ text, url }, index) => {
                const id = referenceId(index)
                return (
                  <li
                    key={url}
                    id={id}
                    tabIndex={-1}
                    className={`mb-1 -mx-2 py-1 pl-8 pr-2 -indent-6 rounded transition-colors duration-700 focus:outline-none ${highlighted === id ? 'bg-light_mustard/70' : ''}`}
                  >
                    {text}{' '}
                    <Link to={url} target='_blank' rel='noopener noreferrer' className='link break-words'>{url}</Link>
                  </li>
                )
              })}
            </ul>
          </section>
        )}
      </div>
    </div>
  )
}

export default Methods
