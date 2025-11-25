import { useState, useEffect } from "react";
import { useGenomeJsonFile } from 'hooks/useJsonData'


interface TaxonomyNode {
  color: string;
  classes?: Record<string, TaxonomyNode>;
  orders?: Record<string, TaxonomyNode>;
}

interface LegendNodeProps {
  name: string;
  data: TaxonomyNode;
  level: number;
  parentLevel: string;
}

type OrderNode = {
  color: string;
};

type ClassNode = {
  color: string;
  order?: Record<string, OrderNode>;
};

type PhylumNode = {
  color: string;
  class?: Record<string, ClassNode>;
};

type ColorScheme = Record<string, PhylumNode>;

type ProcessedMetadata = {
  phylum: string[];
  class: string[];
  order: string[];
};


const TaxonomyChartLegend = ({ selectedTaxonomicLevel, experimentId }: {
  selectedTaxonomicLevel: string,
  experimentId: string
}) => {

  const taxonomicLevels = ["class", "order"]
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set())


  // ===== Get color scheme file for the experiment ====
  const colorSchemeFiles = import.meta.glob('../config/colorScheme/*.ts', {
    eager: true,
  });
  const colorSchemeModule =
    colorSchemeFiles[`../config/colorScheme/taxonomy-color-scheme.ts`];

  if (!colorSchemeModule) {
    throw new Error(`Color scheme for experiment ${experimentId} not found`);
  }
  const colorScheme = (colorSchemeModule && (colorSchemeModule as any).colorScheme) ? (colorSchemeModule as any).colorScheme : {};


  // ===== Get filtered color scheme (filtered legend) for the particular experiment ====

  const metadataData = useGenomeJsonFile(
    'genome_metadata',
    `experiment_${experimentId}_metadata`
  )

  const processedMetadata = metadataData ? {
    phylum: ([...new Set(metadataData.phylum || [])] as string[]).map((item: string) => item.slice(3)),
    class: ([...new Set(metadataData.class || [])] as string[]).map((item: string) => item.slice(3)),
    order: ([...new Set(metadataData.order || [])] as string[]).map((item: string) => item.slice(3))
  } : null;

  function filterColorScheme(
    colorScheme: ColorScheme,
    processedMetadata: ProcessedMetadata
  ): ColorScheme {
    const { phylum, class: classList, order } = processedMetadata;

    const result: ColorScheme = {};

    for (const [phylumName, phylumData] of Object.entries(colorScheme)) {
      if (!phylum.includes(phylumName)) continue;

      const filteredPhylum: PhylumNode = { color: phylumData.color };
      const classes = phylumData.class ?? {};
      const filteredClasses: Record<string, ClassNode> = {};

      for (const [className, classData] of Object.entries(classes)) {
        if (!classList.includes(className)) continue;

        const filteredClass: ClassNode = { color: classData.color };
        const orders = classData.order ?? {};
        const filteredOrders: Record<string, OrderNode> = {};

        for (const [orderName, orderData] of Object.entries(orders)) {
          if (!order.includes(orderName)) continue;
          filteredOrders[orderName] = { color: orderData.color };
        }

        if (Object.keys(filteredOrders).length > 0) {
          filteredClass.order = filteredOrders;
        }

        filteredClasses[className] = filteredClass;
      }

      if (Object.keys(filteredClasses).length > 0) {
        filteredPhylum.class = filteredClasses;
      }

      result[phylumName] = filteredPhylum;
    }

    return result;
  }

  const filteredColorScheme = processedMetadata ? filterColorScheme(colorScheme, processedMetadata) : {}

  // =====================================================

  useEffect(() => {
    const newExpandedNodes = new Set<string>();
    for (const level of taxonomicLevels) {
      if (selectedTaxonomicLevel === 'phylum') {
        newExpandedNodes.add('phylum');
        break;
      }
      newExpandedNodes.add(level);
      if (level === selectedTaxonomicLevel) break;
    }
    setExpandedNodes(newExpandedNodes);
  }, [selectedTaxonomicLevel]);


  const LegendNode: React.FC<LegendNodeProps> = ({ name, data, level, parentLevel }) => {
    const currentLevel = taxonomicLevels[level];
    const isExpanded = expandedNodes.has(currentLevel);
    const children = Object.entries(data[currentLevel as keyof TaxonomyNode] || {});

    return (
      <div className="ml-1.5">
        <div className="flex items-center h-[18px]">
          <div
            className="w-3 h-full mr-1 "
            style={{ backgroundColor: data.color }}
          />
          <span
            className={`whitespace-nowrap my-0.5 max-xl:whitespace-normal max-xl:leading-none
              ${parentLevel === 'phylum' && 'text-lg font-bold mb-2 max-xl:text-base'}
              ${parentLevel === 'class' && 'text-sm font-bold  max-xl:text-xs'}
              ${parentLevel === 'order' && 'text-xs font-semibold max-xl:text-2xs'}
              `}
            style={parentLevel === 'phylum' ? { color: data.color } : undefined}
          >
            {name}
          </span>
        </div>

        {isExpanded && (
          <div className="border-l-[12px] border-gray-300" style={{ borderColor: data.color }}>
            {children.map(([childName, childData]) => (
              <LegendNode
                key={childName}
                name={childName}
                data={childData}
                level={level + 1}
                parentLevel={currentLevel}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-2 h-fit max-h-[80vh] w-[320px] overflow-y-auto bg-gray-100 
      max-md:w-[calc(100%-80px)] max-md:mx-10
    ">
      <div className="space-y-2">
        {Object.entries(filteredColorScheme).map(([name, data]) => (
          <LegendNode key={name} name={name} data={data as TaxonomyNode} level={0} parentLevel="phylum" />
        ))}
      </div>
    </div>
  );
};

export default TaxonomyChartLegend;
