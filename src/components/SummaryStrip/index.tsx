import { Link } from 'react-router-dom'
import chickenImage from 'assets/images/chicken.png'
import pigImage from 'assets/images/pig.png'
import turkeyImage from 'assets/images/turkey.png'

const trialAnimals = [
  { name: 'chicken', label: 'chicken', image: chickenImage },
  { name: 'swine', label: 'pig', image: pigImage },
  { name: 'turkey', label: 'turkey', image: turkeyImage },
]

// A page's headline figures in a strip flush against its header, on the textured
// background of the home page's section blocks. The texture sits on the strip rather
// than on each block so its dots run on unbroken across the separators. A figure
// without a value is shown as a dash
const SummaryStrip = ({ label, stats }: {
  // Names the strip's region for assistive technology
  label: string
  stats: { label: string, value?: string | number, to?: string, title?: string }[]
}) => (
  <section aria-label={label} className='bg-surface_muted bg-texture'>
    <dl className='grid grid-cols-4 max-lg:grid-cols-2'>
      {stats.map(({ label, value, to, title }, index) => {
        const animal = label === 'Trial' && title
          ? trialAnimals.find(({ name }) => title.toLowerCase().includes(name))
          : undefined

        return (
          <div
            key={label}
            className={[
              'page_padding py-5 border-ink text-center',
              index > 0 && 'lg:border-l',
              // Two by two below lg: a vertical rule in each row, and one across between the rows
              index % 2 === 1 && 'max-lg:border-l',
              index >= 2 && 'max-lg:border-t',
            ].filter(Boolean).join(' ')}
          >
            <dt className='text-base text-ink max-lg:text-sm'>{label}</dt>
            <dd className='main_header mt-1 text-3xl text-burgundy_ink max-lg:text-2xl'>
              {to && value != null
                ? <Link to={to} title={title} className={animal
                  ? 'inline-flex items-center gap-2 no-underline hover:text-mustard'
                  : 'no-underline hover:text-mustard'}>
                  {value}
                  {animal && <span
                    role='img'
                    aria-label={animal.label}
                    className='block h-9 w-9 shrink-0 bg-current max-lg:h-7 max-lg:w-7'
                    style={{
                      maskImage: `url(${animal.image})`,
                      WebkitMaskImage: `url(${animal.image})`,
                      maskRepeat: 'no-repeat',
                      WebkitMaskRepeat: 'no-repeat',
                      maskPosition: 'center',
                      WebkitMaskPosition: 'center',
                      maskSize: 'contain',
                      WebkitMaskSize: 'contain',
                    }}
                  />}
                </Link>
                : value ?? '—'}
            </dd>
          </div>
        )
      })}
    </dl>
  </section>
)

export default SummaryStrip
