const DownloadDatabaseSchema = () => {

  return (
    <div className='page_padding flex flex-col'>
      <header className='main_header mb-3'>Download Database Schema </header>
      <p className='page_description mb-0'>
        The database schema provides means to programmatically access the information stored in the 3D’omics data portal. Every ID, accession code and metadata field displayed on the website is hierarchically organised in a JSON format, which makes it possible to fetch the required information using ‘jq’, a lightweight and flexible command-line utility to parse, filter, transform, and process JSON data.
        <br /><br />
        In the following, you can find some examples of how to fetch relevant information from the Database schema file, once downloaded to your local environment.
      </p>

      <div className='flex items-center my-16'>
        <button
          className='px-12 py-4 bg-texture hover:text-mustard main_header text-3xl bg-neutral-100 hover:bg-neutral-200'
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

      <p className='page_description'>
        <span className="font-bold text-xl">Examples</span>
        <br /><br />
        <span className="font-bold text-base">List all individual animal IDs from Experiment G:</span>
        <br />
        jq '.Experiments.G["Individual IDs"][]' 3domics_data_schema.json
        <br /><br /><br />
        <span className="font-bold text-base">List all Biosample accession codes of animals from Experiment F:</span>
        <br />
        jq -r '<br />
        . as $root<br />
        | $root.Experiments.F["Individual IDs"][]<br />
        | $root.Individuals[.]["Biosample accession"]<br />
        ' 3domics_data_schema.json
        <br /><br /><br />
        <span className="font-bold text-base">List all Individual ID's (first column) and their Biosample accession codes (second column) of animals from Experiment J:</span>
        <br />
        jq -r '<br />
        . as $root<br />
        | $root.Experiments.J["Individual IDs"][]<br />
        | . as $id<br />
        | [$id, $root.Individuals[$id]["Biosample accession"]]<br />
        | @tsv<br />
        ' 3domics_data_schema.json
        <br /><br /><br />
        <span className="font-bold text-base">List ENA accession codes of all macrosamples from Experiment H:</span>
        <br />
        jq -r '<br />
        . as $root<br />
        | $root.Experiments.H["Individual IDs"][]<br />
        | $root.Individuals[.]["Macrosample IDs"][]<br />
        | . as $ms<br />
        | $root.Macrosamples[$ms]["ENA accession"]<br />
        | select(. != null)<br />
        ' 3domics_data_schema.json
        <br /><br /><br />
        <span className="font-bold text-base">List ENA accession codes of all microsamples from Experiment G:</span>
        <br />
        jq -r '
        . as $root<br />
        | $root.Experiments.G["Individual IDs"][] as $ind<br />
        | ($root.Individuals[$ind]["Macrosample IDs"] // [])[] as $macro<br />
        | $root.Microsamples<br />
        | to_entries[]<br />
        | select(.value["Macrosample ID"] == $macro)<br />
        | .value["ENA accession"]<br />
        | select(. != null)<br />
        ' 3domics_data_schema.json
      </p>



    </div>
  )
}

export default DownloadDatabaseSchema