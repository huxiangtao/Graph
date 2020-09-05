import {
  IPoint,
  BehaviorOption as IBehaviorOption,
  NodeConfig as INodeConfig,
  ShapeStyle as IShapeStyle,
} from '@antv/g6/lib/types';
import { Graph as IGraph, TreeGraph as ITreeGraph } from '@antv/g6';
import { INode, IEdge } from '@antv/g6/lib/interface/item';
import IGGroup from '@antv/g-canvas/lib/group';
import { ShapeOptions as IShapeOptions } from '@antv/g6/lib/interface/shape';

export interface Graph extends IGraph {}
export interface Node extends INode {}
export interface Edge extends IEdge {}

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
export interface NodeModel extends INodeConfig {}
export interface ShapeStyle extends IShapeStyle {}

export interface CustomShape extends IShapeOptions {}
export interface CustomNode extends CustomShape {}
export interface CustomEdge extends CustomShape {}
export type Item = Node | Edge;
