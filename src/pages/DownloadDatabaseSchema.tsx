import PageHeader from 'components/PageHeader'

const resources = [
  {
    title: 'SQL schema',
    description: 'The tables, columns, indexes and views of catalogue schema version 2. This file contains no records.',
    href: '/database/catalogue-v2.sql',
    download: 'catalogue-v2.sql',
  },
  {
    title: 'JSON Schema',
    description: 'A machine-readable contract for the normalized JSON export, with fixed field names and types.',
    href: '/database/catalogue-v2.schema.json',
    download: 'catalogue-v2.schema.json',
  },
  {
    title: 'Normalized catalogue',
    description: 'The records as arrays of objects, with IDs in fields. Gzip-compressed JSON from the pinned catalogue release.',
    href: '/database/catalogue-v2.json.gz',
    download: 'catalogue-v2.json.gz',
  },
  {
    title: 'Hierarchy export',
    description: 'The original populated, name-keyed JSON hierarchy for jq queries. This is data, not a schema.',
    href: '/database/experiment-hierarchy.json',
    download: 'experiment-hierarchy.json',
  },
]

const DownloadDatabaseSchema = () => (
  <>
    <PageHeader
      title='Data model and downloads'
      breadcrumbs={[
        { label: 'Data Portal Home', link: '/' },
        { label: 'Data model and downloads' },
      ]}
    >
      <p>
        The portal is built from a versioned SQLite catalogue. Its SQL schema describes
        the stored structure; the JSON Schema describes the normalized JSON export.
        Both are separate from the records they describe.
      </p>
    </PageHeader>

    <main className='page_padding py-12'>
      <div className='grid gap-5 md:grid-cols-2'>
        {resources.map(resource => (
          <section key={resource.title} className='border border-line bg-surface_muted p-6'>
            <h2 className='main_header text-xl'>{resource.title}</h2>
            <p className='mt-3 text-ink_muted'>{resource.description}</p>
            <a className='link mt-5 inline-block' href={resource.href} download={resource.download}>
              Download {resource.title.toLowerCase()}
            </a>
          </section>
        ))}
      </div>

      <section className='mt-12 max-w-4xl'>
        <h2 className='main_header text-2xl'>How the records relate</h2>
        <p className='mt-4'>
          Experiments contain animal specimens; specimens yield macrosamples;
          macrosamples can have cryosections and microsamples. Sequencing libraries,
          genome metadata and count matrices form additional layers. Some source
          identifiers do not yet match a released parent record, so the schema guide
          documents those relationships and their current limits.
        </p>
        <p className='mt-4'>
          See the <a className='link' href='https://github.com/3d-omics/database/blob/main/docs/catalogue-schema.md'>
            field and relationship guide
          </a> for meanings, known gaps and examples.
        </p>
        <h3 className='main_header mt-10 text-xl'>Query the normalized export</h3>
        <pre className='mt-4 overflow-x-auto bg-surface_muted p-5 text-sm'><code>{`gzip -dc catalogue-v2.json.gz | jq '.tables.experiments[] | {experiment_id, name}'`}</code></pre>
        <p className='mt-4 text-ink_muted'>
          Use the <a className='link' href='https://zenodo.org/records/22894102'>
            published SQLite catalogue
          </a> or the 3dtk toolkit for larger queries.
        </p>
      </section>
    </main>
  </>
)

export default DownloadDatabaseSchema
