// Text of the Methods pages. Each section is a list of paragraphs; a section
// left empty renders an "in preparation" note instead. References are listed
// at the bottom of the page, each linked through its DOI (or, for software
// without one, its release page or repository), and the list is omitted when empty. Every
// occurrence of a reference's `cite` label in the text becomes a link to it.

export type Reference = {
  cite: string
  text: string
  url: string
}

export type Method = {
  slug: string
  title: string
  intro: string[]
  laboratory: string[]
  bioinformatics: string[]
  references: Reference[]
}

export const methods: Method[] = [
  {
    slug: 'mag-catalogue',
    title: 'MAG Catalogue',
    intro: [
      'Metagenome-assembled genome (MAG) catalogues were reconstructed for each animal trial. Each catalogue gathers the microbial genomes recovered from the samples of that trial, and serves as the reference against which the metagenomic data of macrosamples and microsamples are quantified.',
      'Catalogues were built by combining short-read and long-read sequencing data.',
    ],
    laboratory: [
      'DNA was extracted using a custom purification protocol (Lauritsen et al., 2025) optimised for samples preserved in DNA/RNA Shield buffer (Zymo Research). The protocol starts with bead-beating to physically disrupt the tissue, followed by digestion, separation of DNA from RNA, and purification. Samples were processed in batches of up to 96, each including negative controls: extraction, library preparation and library indexing blanks.',
      'For short-read sequencing, extracted DNA was fragmented to an average length of 350 nucleotides with a Covaris LE220 ultrasonicator, and 200 ng of input DNA was used as standard for library preparation. Libraries were built with the BEST protocol (Carøe et al., 2018), a custom ligation-based method. qPCR assays checked the success of library preparation and determined the number of PCR cycles needed to reach the desired DNA molarity. Libraries were then indexed with unique tags over that number of cycles, bead-purified, and quality-checked on a Fragment Analyzer (Agilent).',
      'Libraries with the expected fragment-size distribution and molarity were pooled in equimolar amounts and sequenced by Novogene, the 3D’omics industrial partner, on Illumina NovaSeq X 10B flow cells with 150 bp paired-end chemistry, to a depth of 6–8 Gbp per sample.',
      'For long-read sequencing, DNA extracts from 8–24 individuals of each poultry trial were pooled into a single sample per trial to meet the higher biomass requirements. The DNA was fragmented to about 7,000 bp and prepared for PacBio sequencing with the SMRTbell Express Template Prep Kit 2.0 (Pacific Biosciences).',
      'PacBio Circular Consensus Sequencing (CCS) ligates hairpin adapters to both ends of a DNA molecule, circularising it so that the polymerase can read each strand several times; a consensus is then called from these subreads. Consensus reads were generated on the instrument, and only HiFi reads (Phred quality above Q20) were kept for downstream analysis. Each of the four pools (one per trial) yielded about 20 Gbp of HiFi reads, with an average read length of around 7 kbp.',
    ],
    bioinformatics: [
      'Short reads were co-assembled with metaSPAdes v3.15.3 (Nurk et al., 2017), with the long reads supplied through its --pacbio option to produce hybrid co-assemblies. Long reads were also assembled on their own with hifiasm-meta r63 (Feng et al., 2022).',
      'Contigs were binned and refined with the HiFi-MAG-Pipeline of Pacific Biosciences (pb-metagenomics-tools release v2.0.2). The pipeline maps the long reads to the assemblies with minimap2 (Li, 2018), bins the contigs with SemiBin2 (Pan et al., 2023), refines the bins with DAS Tool (Sieber et al., 2018), and assesses genome quality with CheckM2 (Chklovski et al., 2023). Each long-read assembly was binned individually.',
      'Assembly metrics were computed with QUAST v5.2.0 (Gurevich et al., 2013), and CoverM v0.6.1 (Aroney et al., 2025) was used to calculate the percentage of reads mapping to the co-assemblies. MAGs were annotated taxonomically with GTDB-Tk v2.1.0 (Chaumeil et al., 2022) against GTDB release R207_v2.',
    ],
    references: [
      {
        cite: 'Aroney et al., 2025',
        text: 'Aroney, S. T. N., Newell, R. J. P., Nissen, J. N., Camargo, A. P., Tyson, G. W., & Woodcroft, B. J. (2025). CoverM: Read alignment statistics for metagenomics. Bioinformatics, 41(4), btaf147.',
        url: 'https://doi.org/10.1093/bioinformatics/btaf147',
      },
      {
        cite: 'Carøe et al., 2018',
        text: 'Carøe, C., Gopalakrishnan, S., Vinner, L., Mak, S. S. T., Sinding, M. H. S., Samaniego, J. A., Wales, N., Sicheritz-Pontén, T., & Gilbert, M. T. P. (2018). Single-tube library preparation for degraded DNA. Methods in Ecology and Evolution, 9(2), 410–419.',
        url: 'https://doi.org/10.1111/2041-210X.12871',
      },
      {
        cite: 'Chaumeil et al., 2022',
        text: 'Chaumeil, P.-A., Mussig, A. J., Hugenholtz, P., & Parks, D. H. (2022). GTDB-Tk v2: Memory friendly classification with the Genome Taxonomy Database. Bioinformatics, 38(23), 5315–5316.',
        url: 'https://doi.org/10.1093/bioinformatics/btac672',
      },
      {
        cite: 'Chklovski et al., 2023',
        text: 'Chklovski, A., Parks, D. H., Woodcroft, B. J., & Tyson, G. W. (2023). CheckM2: A rapid, scalable and accurate tool for assessing microbial genome quality using machine learning. Nature Methods, 20(8), 1203–1212.',
        url: 'https://doi.org/10.1038/s41592-023-01940-w',
      },
      {
        cite: 'Feng et al., 2022',
        text: 'Feng, X., Cheng, H., Portik, D., & Li, H. (2022). Metagenome assembly of high-fidelity long reads with hifiasm-meta. Nature Methods, 19(6), 671–674.',
        url: 'https://doi.org/10.1038/s41592-022-01478-3',
      },
      {
        cite: 'Gurevich et al., 2013',
        text: 'Gurevich, A., Saveliev, V., Vyahhi, N., & Tesler, G. (2013). QUAST: Quality assessment tool for genome assemblies. Bioinformatics, 29(8), 1072–1075.',
        url: 'https://doi.org/10.1093/bioinformatics/btt086',
      },
      {
        cite: 'Lauritsen et al., 2025',
        text: 'Lauritsen, J. G., Carøe, C., Gaun, N., Martin-Bideguren, G., Leonard, A., Eisenhofer, R., Odriozola, I., Gilbert, M. T. P., Aizpurua, O., Alberdi, A., & Pietroni, C. (2025). Robust, open-source and automation-friendly DNA extraction protocol for hologenomic research. Molecular Ecology Resources, 25(8), e70042.',
        url: 'https://doi.org/10.1111/1755-0998.70042',
      },
      {
        cite: 'Li, 2018',
        text: 'Li, H. (2018). Minimap2: Pairwise alignment for nucleotide sequences. Bioinformatics, 34(18), 3094–3100.',
        url: 'https://doi.org/10.1093/bioinformatics/bty191',
      },
      {
        cite: 'Nurk et al., 2017',
        text: 'Nurk, S., Meleshko, D., Korobeynikov, A., & Pevzner, P. A. (2017). metaSPAdes: A new versatile metagenomic assembler. Genome Research, 27(5), 824–834.',
        url: 'https://doi.org/10.1101/gr.213959.116',
      },
      {
        cite: 'pb-metagenomics-tools release v2.0.2',
        text: 'Pacific Biosciences. pb-metagenomics-tools: HiFi-MAG-Pipeline (release v2.0.2) [Computer software].',
        url: 'https://github.com/PacificBiosciences/pb-metagenomics-tools/releases/tag/v2.0.2',
      },
      {
        cite: 'Pan et al., 2023',
        text: 'Pan, S., Zhao, X.-M., & Coelho, L. P. (2023). SemiBin2: Self-supervised contrastive learning leads to better MAGs for short- and long-read sequencing. Bioinformatics, 39(Supplement 1), i21–i29.',
        url: 'https://doi.org/10.1093/bioinformatics/btad209',
      },
      {
        cite: 'Sieber et al., 2018',
        text: 'Sieber, C. M. K., Probst, A. J., Sharrar, A., Thomas, B. C., Hess, M., Tringe, S. G., & Banfield, J. F. (2018). Recovery of genomes from metagenomes via a dereplication, aggregation and scoring strategy. Nature Microbiology, 3(7), 836–843.',
        url: 'https://doi.org/10.1038/s41564-018-0171-1',
      },
    ],
  },
  {
    slug: 'macro-metagenomics',
    title: 'Macro Metagenomics',
    intro: [
      'Macro metagenomics profiles the composition of microbial communities from conventional macro-scale samples of intestinal content and tissue, collected from each animal specimen.',
    ],
    laboratory: [
      'DNA was extracted using a custom purification protocol (Lauritsen et al., 2025) optimised for samples preserved in DNA/RNA Shield buffer (Zymo Research). The protocol starts with bead-beating to physically disrupt the tissue, followed by digestion, separation of DNA from RNA, and purification. Samples were processed in batches of up to 96, each including negative controls: extraction, library preparation and library indexing blanks.',
      'Extracted DNA was fragmented to an average length of 350 nucleotides with a Covaris LE220 ultrasonicator, and 200 ng of input DNA was used as standard for library preparation. Libraries were built with the BEST protocol (Carøe et al., 2018), a custom ligation-based method. qPCR assays checked the success of library preparation and determined the number of PCR cycles needed to reach the desired DNA molarity. Libraries were then indexed with unique tags over that number of cycles, bead-purified, and quality-checked on a Fragment Analyzer (Agilent).',
      'Libraries with the expected fragment-size distribution and molarity were pooled in equimolar amounts and sequenced by Novogene, the 3D’omics industrial partner, on Illumina NovaSeq X 10B flow cells with 150 bp paired-end chemistry, to a depth of 6–8 Gbp per sample.',
    ],
    bioinformatics: [
      'Paired-end reads were trimmed and quality-controlled with fastp v0.20.1 (Chen et al., 2018). Processed reads were then mapped to the concatenated reference genome assemblies using Bowtie2 (Langmead & Salzberg, 2012) and samtools (Li et al., 2009).',
      'Metagenomic quantification, both for macro-scale and micro-scale datasets, was performed with mg_quant, a pipeline developed in-house. This workflow maps the quality-filtered sequencing reads that did not map to the host, contamination and pathogen reference genomes to the MAG catalogue of the corresponding trial using Bowtie2. The resulting BAM files were profiled with CoverM (Aroney et al., 2025) to generate the final sample count table. All downstream statistical analyses were performed with R version 4.4.1.',
    ],
    references: [
      {
        cite: 'Aroney et al., 2025',
        text: 'Aroney, S. T. N., Newell, R. J. P., Nissen, J. N., Camargo, A. P., Tyson, G. W., & Woodcroft, B. J. (2025). CoverM: Read alignment statistics for metagenomics. Bioinformatics, 41(4), btaf147.',
        url: 'https://doi.org/10.1093/bioinformatics/btaf147',
      },
      {
        cite: 'Carøe et al., 2018',
        text: 'Carøe, C., Gopalakrishnan, S., Vinner, L., Mak, S. S. T., Sinding, M. H. S., Samaniego, J. A., Wales, N., Sicheritz-Pontén, T., & Gilbert, M. T. P. (2018). Single-tube library preparation for degraded DNA. Methods in Ecology and Evolution, 9(2), 410–419.',
        url: 'https://doi.org/10.1111/2041-210X.12871',
      },
      {
        cite: 'Chen et al., 2018',
        text: 'Chen, S., Zhou, Y., Chen, Y., & Gu, J. (2018). fastp: An ultra-fast all-in-one FASTQ preprocessor. Bioinformatics, 34(17), i884–i890.',
        url: 'https://doi.org/10.1093/bioinformatics/bty560',
      },
      {
        cite: 'Langmead & Salzberg, 2012',
        text: 'Langmead, B., & Salzberg, S. L. (2012). Fast gapped-read alignment with Bowtie 2. Nature Methods, 9(4), 357–359.',
        url: 'https://doi.org/10.1038/nmeth.1923',
      },
      {
        cite: 'Lauritsen et al., 2025',
        text: 'Lauritsen, J. G., Carøe, C., Gaun, N., Martin-Bideguren, G., Leonard, A., Eisenhofer, R., Odriozola, I., Gilbert, M. T. P., Aizpurua, O., Alberdi, A., & Pietroni, C. (2025). Robust, open-source and automation-friendly DNA extraction protocol for hologenomic research. Molecular Ecology Resources, 25(8), e70042.',
        url: 'https://doi.org/10.1111/1755-0998.70042',
      },
      {
        cite: 'Li et al., 2009',
        text: 'Li, H., Handsaker, B., Wysoker, A., Fennell, T., Ruan, J., Homer, N., Marth, G., Abecasis, G., Durbin, R., & 1000 Genome Project Data Processing Subgroup. (2009). The Sequence Alignment/Map format and SAMtools. Bioinformatics, 25(16), 2078–2079.',
        url: 'https://doi.org/10.1093/bioinformatics/btp352',
      },
      {
        cite: 'mg_quant',
        text: '3D’omics. mg_quant: Metagenomic quantification pipeline [Computer software].',
        url: 'https://github.com/3d-omics/mg_quant',
      },
    ],
  },
  {
    slug: 'micro-metagenomics',
    title: 'Micro Metagenomics',
    intro: [
      'Micro metagenomics profiles the composition of microbial communities at the micro-scale. Microsamples are collected through laser microdissection from thin intestinal cross-cuts (cryosections), preserving the spatial position of each sample within the intestine.',
    ],
    laboratory: [
      'Immediately after euthanasia, a section of about 2 cm was dissected from the caecum of each chicken or turkey and placed in an individual tissue cassette (Simport). Sections were handled only at the cut edges to preserve the integrity of their central part. They were then rinsed with 50% glycerol to maintain cell integrity, snap-frozen in liquid nitrogen, and stored at −80 °C until further processing.',
      'In a pre-PCR laboratory, the frozen sections were cut into sub-segments of 0.5–0.7 cm with a mitre cutter (RP TOOLZ). Each sub-segment was mounted transversely on a thin layer of embedding matrix in a cryomold and frozen at −80 °C for 2 minutes, then fully submerged in a further layer of 2% carboxymethyl cellulose (CMC) embedding matrix and frozen again at −80 °C. Cryosectioning was performed on a Leica CM3050S cryostat (Leica Microsystems, Wetzlar, Germany) with a chamber temperature of −26 °C and an object temperature of −16 °C. Consecutive sections 10 µm thick were mounted on PEN membrane frame slides, which were kept at −80 °C until further processing.',
      'Laser microdissection (LMD) was performed in a pre-PCR laboratory with a Leica LMD7 microscope (Leica Microsystems, Wetzlar, Germany) housed in a dedicated cold room at 10 °C. The microscope was fitted with a custom-made enclosure and stage refrigeration system, which kept the slide at 4 °C or below and physically isolated it from the environment during microdissection. Laser settings were adjusted to the size of the microsamples collected, each covering an area of 5,000 µm². Areas of interest were identified and outlined in the Leica microscope software, and the microsamples were collected into 8-strip lids (8 AFA-TUBE TPX Strip Caps, Covaris). Each collection was checked by direct visualisation under the microscope, and the area was resampled if the lid was seen to be empty. LMD information was logged and visualised with a custom script, Bioinfo_Micro_LMD_export.',
      'Each microsample was lysed in a pre-PCR laboratory in 10 µL of a custom lysis buffer optimised for LMD samples. Lysis consisted of an initial incubation at 37 °C for 30 minutes and an overnight incubation at 60 °C, followed by heat-inactivation of the enzymes at 75 °C for 30 minutes. The crude lysate was then diluted to 25 µL with sterile dH₂O, and the DNA was sheared to an average length of 350 nucleotides with a Covaris LE220 ultrasonicator. Micro-scale metagenomic libraries were built on an automated workstation (Fluent Automation Workstation, Tecan) following a 3D’omics-optimised version of the Ovation Ultralow Library Systems V2 protocol.',
      'Indexed libraries were pooled in equal volumes and sequenced across multiple lanes of Illumina NovaSeq X 10B flow cells with 150 bp paired-end chemistry, to a target depth of 4 Gbp per microsample.',
    ],
    bioinformatics: [
      'Paired-end reads were trimmed and quality-controlled with fastp v0.20.1 (Chen et al., 2018). Processed reads were then mapped to the concatenated reference genome assemblies using Bowtie2 (Langmead & Salzberg, 2012) and samtools (Li et al., 2009).',
      'Metagenomic quantification, both for macro-scale and micro-scale datasets, was performed with mg_quant, a pipeline developed in-house. This workflow maps the quality-filtered sequencing reads that did not map to the host, contamination and pathogen reference genomes to the MAG catalogue of the corresponding trial using Bowtie2. The resulting BAM files were profiled with CoverM (Aroney et al., 2025) to generate the final sample count table. All downstream statistical analyses were performed with R version 4.4.1.',
    ],
    references: [
      {
        cite: 'Aroney et al., 2025',
        text: 'Aroney, S. T. N., Newell, R. J. P., Nissen, J. N., Camargo, A. P., Tyson, G. W., & Woodcroft, B. J. (2025). CoverM: Read alignment statistics for metagenomics. Bioinformatics, 41(4), btaf147.',
        url: 'https://doi.org/10.1093/bioinformatics/btaf147',
      },
      {
        cite: 'Bioinfo_Micro_LMD_export',
        text: '3D’omics. Bioinfo_Micro_LMD_export: Logging and visualisation of laser microdissection data [Computer software].',
        url: 'https://github.com/3d-omics/Bioinfo_Micro_LMD_export',
      },
      {
        cite: 'Chen et al., 2018',
        text: 'Chen, S., Zhou, Y., Chen, Y., & Gu, J. (2018). fastp: An ultra-fast all-in-one FASTQ preprocessor. Bioinformatics, 34(17), i884–i890.',
        url: 'https://doi.org/10.1093/bioinformatics/bty560',
      },
      {
        cite: 'Langmead & Salzberg, 2012',
        text: 'Langmead, B., & Salzberg, S. L. (2012). Fast gapped-read alignment with Bowtie 2. Nature Methods, 9(4), 357–359.',
        url: 'https://doi.org/10.1038/nmeth.1923',
      },
      {
        cite: 'Li et al., 2009',
        text: 'Li, H., Handsaker, B., Wysoker, A., Fennell, T., Ruan, J., Homer, N., Marth, G., Abecasis, G., Durbin, R., & 1000 Genome Project Data Processing Subgroup. (2009). The Sequence Alignment/Map format and SAMtools. Bioinformatics, 25(16), 2078–2079.',
        url: 'https://doi.org/10.1093/bioinformatics/btp352',
      },
      {
        cite: 'mg_quant',
        text: '3D’omics. mg_quant: Metagenomic quantification pipeline [Computer software].',
        url: 'https://github.com/3d-omics/mg_quant',
      },
    ],
  },
  {
    slug: 'metabolomics',
    title: 'Metabolomics',
    intro: [
      'Metabolic landscapes of the intestine were produced for each animal specimen using intestinal content and tissue samples.',
    ],
    laboratory: [],
    bioinformatics: [],
    references: [],
  },
]
