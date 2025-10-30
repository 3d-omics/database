import Airtable from 'airtable';
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import { airtableConfig } from 'config/airtable';

// const base = new Airtable({ apiKey: process.env.VITE_AIRTABLE_API_KEY })
  // .base(process.env.VITE_AIRTABLE_BASE_ID!);

const {
  animalTrialExperimentBaseId, animalTrialExperimentTableId, animalTrialExperimentViewId,
  animalSpecimenBaseId, animalSpecimenTableId, animalSpecimenViewId,
  intestinalSectionSampleBaseId, intestinalSectionSampleTableId, intestinalSectionSampleViewId,
  cryosectionBaseId, cryosectionTableId, cryosectionViewId,
  microsampleBaseId, microsampleTableId, microsampleViewId,
  microsamplesWithCoordinationBaseId, microsamplesWithCoordinationTableId, microsamplesWithCoordinationViewId,
  cryosectionImageBaseId, cryosectionImageTableId, cryosectionImageViewId,
  experimentsWithGenomeInfoBaseId, experimentsWithGenomeInfoTableId, experimentsWithGenomeInfoViewId,
  macrosampleBaseId, macrosampleTableId, macrosampleViewId,
} = airtableConfig

const TABLES_CONFIG = [
  {
    name: 'AnimalTrialExperiment',
    baseId: animalTrialExperimentBaseId,
    tableId: animalTrialExperimentTableId,
    viewId: animalTrialExperimentViewId,
  },
  {
    name: 'AnimalSpecimen',
    baseId: animalSpecimenBaseId,
    tableId: animalSpecimenTableId,
    viewId: animalSpecimenViewId,
  },
  {
    name: 'IntestinalSectionSample',
    baseId: intestinalSectionSampleBaseId,
    tableId: intestinalSectionSampleTableId,
    viewId: intestinalSectionSampleViewId,
  },
  {
    name: 'Cryosection', 
    baseId: cryosectionBaseId,
    tableId: cryosectionTableId,
    viewId: cryosectionViewId,
  },
  {
    name: 'Microsample',
    baseId: microsampleBaseId,
    tableId: microsampleTableId,
    viewId: microsampleViewId,
  },
  {
    name: 'MicrosamplesWithCoordination',
    baseId: microsamplesWithCoordinationBaseId,
    tableId: microsamplesWithCoordinationTableId,
    viewId: microsamplesWithCoordinationViewId,
  },
  {
    name: 'CryosectionImage',
    baseId: cryosectionImageBaseId,
    tableId: cryosectionImageTableId,
    viewId: cryosectionImageViewId,
  },
  {
    name: 'ExperimentsWithGenomeInfo',
    baseId: experimentsWithGenomeInfoBaseId,
    tableId: experimentsWithGenomeInfoTableId,
    viewId: experimentsWithGenomeInfoViewId,
  },
  {
    name: 'Macrosample',
    baseId: macrosampleBaseId,
    tableId: macrosampleTableId,
    viewId: macrosampleViewId,
  },
]

interface AirtableRecord {
  id: string;
  createdTime: string;
  fields: Record<string, any>;
}

// ============================================
// PART 1: Fetch Airtable Data
// ============================================

async function fetchTableData(
  baseId: string,
  tableId: string,
  viewId: string
): Promise<AirtableRecord[]> {
  const tableBase = new Airtable({ apiKey: process.env.VITE_AIRTABLE_API_KEY })
    .base(baseId);

  console.log(`Fetching ${tableId} from base ${baseId}...`);
  
  try {
    const records = await tableBase(tableId)
      .select({ view: viewId })
      .all();

    const allRecords = records.map(record => ({
      id: record.id,
      createdTime: record._rawJson.createdTime,
      fields: record.fields as Record<string, any>,
    }));

    console.log(`✅ Fetched ${allRecords.length} records from ${tableId}`);
    return allRecords;
  } catch (error) {
    console.error(`❌ Error fetching ${tableId}:`, error);
    return [];
  }
}

async function fetchAirtableData(): Promise<void> {
  console.log('\n📊 FETCHING AIRTABLE DATA...\n');
  
  const dataPromises = TABLES_CONFIG.map(async (config) => {
    const data = await fetchTableData(config.baseId, config.tableId, config.viewId);
    return { name: config.name, data };
  });

  const results = await Promise.all(dataPromises);
  
  const outputDir = path.join(process.cwd(), 'src', 'assets', 'data', 'airtable');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  results.forEach(({ name, data }) => {
    const fileName = `${name.toLowerCase()}.json`;
    fs.writeFileSync(
      path.join(outputDir, fileName),
      JSON.stringify(data, null, 2)
    );
    console.log(`✅ ${name}: ${data.length} records saved to ${fileName}`);
  });

  const metadata = {
    lastFetched: new Date().toISOString(),
    tables: results.map(({ name, data }) => ({
      name,
      recordCount: data.length,
    })),
  };
  
  fs.writeFileSync(
    path.join(outputDir, '_metadata.json'),
    JSON.stringify(metadata, null, 2)
  );
}

// ============================================
// PART 2: Convert CSV Files to JSON
// ============================================

function convertCsvToColumnFormat(csvContent: string): Record<string, any[]> {
  const parsed = Papa.parse(csvContent, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
  });

  // Convert rows to columns
  const columnData: Record<string, any[]> = {};
  const rows = parsed.data as Record<string, any>[];

  if (Array.isArray(rows) && rows.length > 0) {
    const headers = Object.keys(rows[0] || {});
    headers.forEach(header => {
      columnData[header] = rows.map((row: any) => row[header]);
    });
  }

  return columnData;
}

async function convertCsvFolder(
  folderName: string,
  description: string
): Promise<void> {
  console.log(`\n📄 Converting ${description}...`);
  
  const csvDir = path.join(process.cwd(), 'src', 'assets', 'data', folderName);
  const outputDir = path.join(process.cwd(), 'src', 'assets', 'data', `${folderName}_json`);
  
  if (!fs.existsSync(csvDir)) {
    console.log(`⚠️  Directory not found: ${csvDir}`);
    return;
  }

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const csvFiles = fs.readdirSync(csvDir).filter(file => file.endsWith('.csv'));
  
  if (csvFiles.length === 0) {
    console.log(`⚠️  No CSV files found in ${folderName}`);
    return;
  }

  console.log(`Found ${csvFiles.length} CSV files`);
  
  let successCount = 0;
  
  for (const csvFile of csvFiles) {
    try {
      const csvPath = path.join(csvDir, csvFile);
      const csvContent = fs.readFileSync(csvPath, 'utf8');
      
      const columnData = convertCsvToColumnFormat(csvContent);
      
      const jsonFileName = csvFile.replace('.csv', '.json');
      fs.writeFileSync(
        path.join(outputDir, jsonFileName),
        JSON.stringify(columnData, null, 2)
      );
      
      successCount++;
      console.log(`  ✅ ${csvFile} → ${jsonFileName}`);
    } catch (error) {
      console.error(`  ❌ Error converting ${csvFile}:`, error);
    }
  }
  
  console.log(`✅ Converted ${successCount}/${csvFiles.length} files from ${folderName}`);
}

async function convertAllCsvs(): Promise<void> {
  console.log('\n📊 CONVERTING CSV FILES TO JSON...\n');
  
  await convertCsvFolder('genome_metadata', 'genome metadata files (14 files)');
  await convertCsvFolder('macro_genome_counts', 'macro genome counts files (14 files)');
  await convertCsvFolder('microsample_counts', 'microsample counts files (65 files)');
}

// ============================================
// MAIN FUNCTION
// ============================================

async function fetchAllData(): Promise<void> {
  const startTime = Date.now();
  
  console.log('╔════════════════════════════════════════════╗');
  console.log('║   DATA GENERATION SCRIPT                   ║');
  console.log('╚════════════════════════════════════════════╝');
  
  try {
    // Step 1: Fetch Airtable data
    await fetchAirtableData();
    
    // Step 2: Convert CSV files to JSON
    await convertAllCsvs();
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log('\n╔════════════════════════════════════════════╗');
    console.log(`║   ✅ ALL DATA GENERATED IN ${duration}s         ║`);
    console.log('╚════════════════════════════════════════════╝\n');
  } catch (error) {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  }
}

fetchAllData();
