import React from 'react';
import { Graph } from '@/common/interfaces';

export interface GraphContextProps {
  graph: Graph | null;
  setMode(mode: string): void;
  setGraph(graph: Graph): void;
}
export const GraphContext = React.createContext({} as GraphContextProps);
