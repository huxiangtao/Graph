import { IPoint, BehaviorOption as IBehaviorOption } from '@antv/g6/lib/types';
import { Graph as IGraph, TreeGraph as ITreeGraph } from '@antv/g6';
import IGGroup from '@antv/g-canvas/lib/group';

export interface Graph extends IGraph {}
export interface Behavior extends IBehaviorOption {
  graph?: Graph;
  graphMode?: string;
  [propName: string]: any;
}

export interface RegisteredBehaviors {
  [propName: string]: any;
}

export interface AnchorPoint extends IPoint {
  index: number;
}

export interface GGroup extends IGGroup {}
