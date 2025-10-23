import { useState, useEffect } from "react";

interface TaxonomyNode {
  color: string;
  classes?: Record<string, TaxonomyNode>;
  orders?: Record<string, TaxonomyNode>;
  families?: Record<string, TaxonomyNode>;
  genus?: Record<string, TaxonomyNode>;
  species?: Record<string, TaxonomyNode>;
}

interface LegendNodeProps {
  name: string;
  data: TaxonomyNode;
  level: number;
  parentLevel: string;
}
const TaxonomyChartLegend = ({ selectedTaxonomicLevel, experimentId }: {
  selectedTaxonomicLevel: string,
  experimentId: string
}) => {

  const taxonomicLevels = ["class", "order", "family", "genus", "species"]
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set())

  
  // ===== Get color scheme file for the experiment ====
  const colorSchemeFiles = import.meta.glob('../config/colorScheme/*.ts', {
    eager: true,
  });
  const colorSchemeModule =
    colorSchemeFiles[`../config/colorScheme/taxonomy-color-scheme-${experimentId}.ts`];

  if (!colorSchemeModule) {
    throw new Error(`Color scheme for experiment ${experimentId} not found`);
  }
  const colorScheme = (colorSchemeModule && (colorSchemeModule as any).colorScheme) ? (colorSchemeModule as any).colorScheme : {};
  
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
              ${parentLevel === 'family' && 'text-xs max-xl:text-2xs'}
              ${parentLevel === 'genus' && 'text-2xs font-semibold max-xl:text-3xs'}
              ${parentLevel === 'species' && 'text-2xs max-xl:text-3xs'}
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
        {Object.entries(colorScheme).map(([name, data]) => (
          <LegendNode key={name} name={name} data={data as TaxonomyNode} level={0} parentLevel="phylum" />
        ))}
      </div>
    </div>
  );
};

export default TaxonomyChartLegend;
