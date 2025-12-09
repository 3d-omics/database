const DownloadDatabaseSchema = () => {

  return (
    <div className='page_padding min-h-[calc(100dvh-(var(--navbar-height)+var(--footer-height)))] flex flex-col'>
      <header className='main_header mb-3'>Download Database Schema </header>
      <p className='page_description'>This is where you can download all the Database schema for the 3d'omics project. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer sit amet ipsum molestie ex dictum venenatis eu non dui. Fusce nec aliquet diam. Donec vel massa quis felis cursus laoreet sed in est. Vivamus tincidunt eros vel mauris blandit maximus. Phasellus cursus nisi id ante luctus, ut semper augue fringilla. </p>

      <div className='flex-1 flex items-center justify-center'>
        <button
          className='px-6 py-3 bg-texture hover:text-mustard main_header text-3xl bg-neutral-100 hover:bg-neutral-200'
          onClick={() => {
            const link = document.createElement('a');
            link.href = '/database/experiment-hierarchy.json';
            link.download = '3domics_data_schema.json';
            link.click();
          }}
        >
          Download JSON file
        </button>
      </div>

    </div>
  )
}

export default DownloadDatabaseSchema