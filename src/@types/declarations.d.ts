declare module 'tailwind-hamburgers';

declare module '*.xlsx' {
  const value: string;
  export default value;
}

declare module "*.csv" {
  const content: string;
  export default content;
}

declare module "*.tsv" {
  const content: string;
  export default content;
}

declare module 'jstat' {
  const jStat: any;
  export = jStat;
}

declare module '*.svg?react' {
  import * as React from 'react';
  const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}

declare module '*.svg' {
  const content: string;
  export default content;
}

declare module 'circos' {
  const Circos: any;
  export default Circos;
}

declare module 'phylocanvas' {
  export function createTree(element: HTMLElement, options: any): any;
}