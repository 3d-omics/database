import Airtable from 'airtable';
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import { airtableConfig } from 'config/airtable';

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
  
  await convertCsvFolder('genome_metadata', 'genome metadata files (6 files)');
  await convertCsvFolder('macro_genome_counts', 'macro genome counts files (6 files)');
  await convertCsvFolder('microsample_counts', 'microsample counts files (84? files)');
}

// ============================================
// PART 3: Build Experiment Hierarchy
// ============================================

// Helper function to extract first element if array
function extractValue(value: any): any {
  if (Array.isArray(value) && value.length > 0) {
    return value[0];
  }
  return value;
}

interface ExperimentHierarchy {
  Projects: Record<string, {
    Name: string;
    'Bioproject accession': string;
    'Start date': string;
    'End date': string;
    'Experiment IDs': string[];
  }>;
  Experiments: Record<string, Record<string, any>>;
  Individuals: Record<string, Record<string, any>>;
  Macrosamples: Record<string, Record<string, any>>;
  Cryosections: Record<string, Record<string, any>>;
  Microsamples: Record<string, Record<string, any>>;
}

async function buildExperimentHierarchy(): Promise<void> {
  console.log('\n🏗️  BUILDING EXPERIMENT HIERARCHY...\n');
  
  const dataDir = path.join(process.cwd(), 'src', 'assets', 'data', 'airtable');
  
  // Load all required JSON files
  const loadJsonFile = (filename: string): AirtableRecord[] => {
    const filePath = path.join(dataDir, filename);
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${filename}`);
      return [];
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  };

  const experiments_records = loadJsonFile('animaltrialexperiment.json');
  const specimens = loadJsonFile('animalspecimen.json');
  const macrosamples_records = loadJsonFile('intestinalsectionsample.json');
  const cryosections_records = loadJsonFile('cryosection.json');
  const microsamples_records = loadJsonFile('microsample.json');

  // Initialize hierarchy structure
  const hierarchy: ExperimentHierarchy = {
    Projects: {},
    Experiments: {},
    Individuals: {},
    Macrosamples: {},
    Cryosections: {},
    Microsamples: {},
  };

  // Build experiment record ID to experiment ID mapping
  const experimentRecordToId: Record<string, string> = {};
  const experimentIds: string[] = [];

  experiments_records.forEach(record => {
    const fields = record.fields;
    const experimentId = fields['ID'];
    const name = fields['Name'];
    const bioproject = fields['Bioproject accession'];
    const startDate = fields['StartDate'];
    const endDate = fields['EndDate'];
    const experimentRecordId = record.id;
    
    // Skip if missing required fields
    if (!experimentId || !name || !bioproject) return;

    // Map record ID to experiment ID
    if (experimentRecordId) {
      experimentRecordToId[experimentRecordId] = experimentId;
    }

    experimentIds.push(experimentId);

    // Build experiment data (NOTE: ID is NOT stored in the value, only as key)
    const experimentData: Record<string, any> = {
      'Name': name,
      'Bioproject accession': bioproject,
    };

    // Add optional date fields
    if (startDate) {
      experimentData['Start date'] = startDate;
    }
    if (endDate) {
      experimentData['End date'] = endDate;
    }

    hierarchy.Experiments[experimentId] = experimentData;
  });

  // Group specimens by experiment
  const specimensByExperiment: Record<string, string[]> = {};

  specimens.forEach(specimen => {
    const fields = specimen.fields;
    const specimenId = fields['ID'];
    const biosample = fields['Biosample accession'];
    const linkedExperiments = fields['Experiment'] || [];
    const treatmentCode = fields['Treatment_flat'];
    const weight = fields['Weight'];
    const sex = fields['Sex'];
    const speciesScientific = fields['species_scientific'];
    const speciesCommon = fields['species_common'];
    const taxid = fields['taxid'];
    const lifestage = fields['lifestage'];
    
    if (!specimenId || !biosample || !linkedExperiments || !Array.isArray(linkedExperiments)) return;

    // Build individual data
    const individualData: Record<string, any> = {
      'Biosample accession': biosample,
    };

    // Add optional fields, extracting from arrays when needed
    if (treatmentCode) {
      individualData['Treatment'] = extractValue(treatmentCode);
    }

    if (weight !== null && weight !== undefined) {
      individualData['Weight'] = weight;
    }

    if (sex) {
      individualData['Sex'] = extractValue(sex);
    }

    if (speciesScientific) {
      individualData['Species (scientific name)'] = extractValue(speciesScientific);
    }

    if (speciesCommon) {
      individualData['Species (common name)'] = extractValue(speciesCommon);
    }

    if (taxid) {
      individualData['Species (taxid)'] = extractValue(taxid);
    }

    if (lifestage) {
      individualData['Lifestage'] = extractValue(lifestage);
    }

    hierarchy.Individuals[specimenId] = individualData;

    // Link specimens to experiments
    linkedExperiments.forEach((expRecordId: string) => {
      const experimentId = experimentRecordToId[expRecordId];
      if (!experimentId) return;

      if (!specimensByExperiment[experimentId]) {
        specimensByExperiment[experimentId] = [];
      }
      specimensByExperiment[experimentId].push(specimenId);
    });
  });

  // Add individual IDs to experiments
  Object.keys(specimensByExperiment).forEach(experimentId => {
    if (hierarchy.Experiments[experimentId]) {
      hierarchy.Experiments[experimentId]['Individual IDs'] = specimensByExperiment[experimentId];
    }
  });

  // Group macrosamples by individual
  const macrosamplesByIndividual: Record<string, string[]> = {};

  macrosamples_records.forEach(sample => {
    const fields = sample.fields;
    const sampleId = fields['ID'];
    const individualId = fields['Individual'];
    const sampleType = fields['Sample type'];
    const enaAccession = fields['ENA accession'];
    const metabolightsAccession = fields['Metabolights accession'];
    
    if (!sampleId || !individualId) return;

    const sampleData: Record<string, any> = {};

    if (sampleType) {
      sampleData['Sample type'] = sampleType;
    }

    if (enaAccession) {
      const enaValue = extractValue(enaAccession);
      if (enaValue) {
        sampleData['ENA accession'] = enaValue;
      }
    }

    if (metabolightsAccession) {
      sampleData['Metabolights accession'] = metabolightsAccession;
    }

    hierarchy.Macrosamples[sampleId] = sampleData;

    if (!macrosamplesByIndividual[individualId]) {
      macrosamplesByIndividual[individualId] = [];
    }
    macrosamplesByIndividual[individualId].push(sampleId);
  });

  // Add macrosample IDs to individuals
  Object.keys(macrosamplesByIndividual).forEach(individualId => {
    if (hierarchy.Individuals[individualId]) {
      hierarchy.Individuals[individualId]['Macrosample IDs'] = macrosamplesByIndividual[individualId];
    }
  });

  // Group cryosections by prefix (first 6 characters of ID)
  const cryosectionsByPrefix: Record<string, string[]> = {};
  const cryosectionMicrosamples: Record<string, string[]> = {};

  cryosections_records.forEach(cryo => {
    const fields = cryo.fields;
    const cryoId = fields['ID'];
    const dateValue = fields['SlideDate'];
    
    if (!cryoId) return;

    const cryoData: Record<string, any> = {};

    if (dateValue) {
      cryoData['Date'] = extractValue(dateValue);
    }

    hierarchy.Cryosections[cryoId] = cryoData;

    // Get first 6 characters as prefix
    const prefix = cryoId.length >= 6 ? cryoId.substring(0, 6) : cryoId;
    if (!cryosectionsByPrefix[prefix]) {
      cryosectionsByPrefix[prefix] = [];
    }
    cryosectionsByPrefix[prefix].push(cryoId);
  });

  // Group microsamples by macrosample
  const microsamplesByMacrosample: Record<string, string[]> = {};

  microsamples_records.forEach(micro => {
    const fields = micro.fields;
    const code = fields['Code'];
    const dateValue = fields['Date'];
    const xCoord = fields['Xcoord'];
    const yCoord = fields['Ycoord'];
    const size = fields['Size'];
    const batch = fields['LMBatch_flat'];
    const enaAccession = fields['ENA accession'];
    const sampleType = fields['Sample_type'];
    
    if (!code) return;

    const microsampleData: Record<string, any> = {};

    if (dateValue) {
      microsampleData['Date'] = dateValue;
    }

    if (xCoord !== null && xCoord !== undefined) {
      microsampleData['Xcoord'] = xCoord;
    }

    if (yCoord !== null && yCoord !== undefined) {
      microsampleData['Ycoord'] = yCoord;
    }

    if (size !== null && size !== undefined) {
      microsampleData['Size'] = size;
    }

    if (batch) {
      microsampleData['Batch'] = extractValue(batch);
    }

    if (enaAccession) {
      microsampleData['ENA accession'] = extractValue(enaAccession);
    }

    if (sampleType) {
      microsampleData['Sample type'] = extractValue(sampleType);
    }

    // Get macrosample ID from first 6 characters of code (KEY DIFFERENCE!)
    const macrosampleId = code.length >= 6 ? code.substring(0, 6) : code;

    // Only add if macrosample exists
    if (hierarchy.Macrosamples[macrosampleId]) {
      microsampleData['Macrosample ID'] = macrosampleId;
      
      if (!microsamplesByMacrosample[macrosampleId]) {
        microsamplesByMacrosample[macrosampleId] = [];
      }
      microsamplesByMacrosample[macrosampleId].push(code);
    }

    // Link to cryosections via prefix
    const cryoIds = cryosectionsByPrefix[macrosampleId];
    if (cryoIds) {
      cryoIds.forEach(cryoId => {
        if (!cryosectionMicrosamples[cryoId]) {
          cryosectionMicrosamples[cryoId] = [];
        }
        cryosectionMicrosamples[cryoId].push(code);
      });
    }

    hierarchy.Microsamples[code] = microsampleData;
  });

  // Add microsample IDs to cryosections
  Object.keys(cryosectionMicrosamples).forEach(cryoId => {
    if (hierarchy.Cryosections[cryoId]) {
      hierarchy.Cryosections[cryoId]['Microsample IDs'] = cryosectionMicrosamples[cryoId];
    }
  });

  // Add microsample IDs to macrosamples
  Object.keys(microsamplesByMacrosample).forEach(macrosampleId => {
    if (hierarchy.Macrosamples[macrosampleId]) {
      hierarchy.Macrosamples[macrosampleId]['Microsample IDs'] = microsamplesByMacrosample[macrosampleId];
    }
  });

  // Add project metadata (3D'omics project)
  hierarchy.Projects["3D'omics"] = {
    Name: "3D'omics",
    'Bioproject accession': 'PRJEB86267',
    'Start date': '2021-09-01',
    'End date': '2025-12-31',
    'Experiment IDs': experimentIds,
  };

  // Save to public folder
  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const outputPath = path.join(publicDir, 'experiment-hierarchy.json');
  fs.writeFileSync(outputPath, JSON.stringify(hierarchy, null, 2));

  console.log(`✅ Experiment hierarchy saved to public/experiment-hierarchy.json`);
  console.log(`   - ${Object.keys(hierarchy.Projects).length} Projects`);
  console.log(`   - ${Object.keys(hierarchy.Experiments).length} Experiments`);
  console.log(`   - ${Object.keys(hierarchy.Individuals).length} Individuals`);
  console.log(`   - ${Object.keys(hierarchy.Macrosamples).length} Macrosamples`);
  console.log(`   - ${Object.keys(hierarchy.Cryosections).length} Cryosections`);
  console.log(`   - ${Object.keys(hierarchy.Microsamples).length} Microsamples`);
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
    
    // Step 3: Build experiment hierarchy
    await buildExperimentHierarchy();
    
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