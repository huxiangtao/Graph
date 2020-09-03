import { INode, IEdge } from '@antv/g6/lib/interface/item';
import behaviorManager from '@/common/behaviorManager';
import { Behavior, AnchorPoint } from '@/common/interfaces';

interface DefaultConfig {
  /** 边线类型 */
  edgeType: string;
  multiple: boolean;
  /** 获取来源节点锚点状态 */
  // getAnchorPointStateOfSourceNode(sourceNode: Node, sourceAnchorPoint: AnchorPoint): AnchorPointState;
  // /** 获取目标节点锚点状态 */
  // getAnchorPointStateOfTargetNode(
  //   sourceNode: Node,
  //   sourceAnchorPoint: AnchorPoint,
  //   targetNode: Node,
  //   targetAnchorPoint: AnchorPoint,
  // ): AnchorPointState;
}

interface DragAddEdgeBehavior {
  edge: IEdge | null;
}

const dragAddEdgeBehavior: Behavior = {
  getDefaultCfg(): DefaultConfig {
    return {
      edgeType: 'bizFlowEdge',
      multiple: true,
    };
  },
  getEvents() {
    return {
      'node:mouseenter': 'handleNodeMouseEnter',
      'node:mouseleave': 'handleNodeMouseLeave',
      'node:mousedown': 'handleNodeMouseDown',
      mousemove: 'handleMouseMove',
      mouseup: 'handleMouseUp',
    };
  },
  handleNodeMouseEnter(e: any) {
    const graph: any = this.graph;
    const item = e.item;
    console.log(item, 'elliot-item-130');
  },
  handleNodeMouseLeave(e: any) {},
  handleNodeMouseDown(e: any) {},
  handleMouseMove(e: any) {},
  handleMouseUp(e: any) {},
};

behaviorManager.register('drag-add-edge', dragAddEdgeBehavior);
