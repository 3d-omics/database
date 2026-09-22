// A page's headline figures in a strip flush against its header, on the textured
// background of the home page's section blocks. The texture sits on the strip rather
// than on each block so its dots run on unbroken across the separators. A figure
// without a value is shown as a dash
const SummaryStrip = ({ label, stats }: {
  // Names the strip's region for assistive technology
  label: string
  stats: { label: string, value?: string | number }[]
}) => (
  <section aria-label={label} className='bg-surface_muted bg-texture'>
    <dl className='grid grid-cols-4 max-lg:grid-cols-2'>
      {stats.map(({ label, value }, index) => (
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
          <dd className='main_header mt-1 text-3xl text-burgundy_ink max-lg:text-2xl'>{value ?? '—'}</dd>
        </div>
      ))}
    </dl>
  </section>
)

export default SummaryStrip
