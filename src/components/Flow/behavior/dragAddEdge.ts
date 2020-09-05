import { INode, IEdge } from '@antv/g6/lib/interface/item';
import behaviorManager from '@/common/behaviorManager';
import { Behavior, AnchorPoint, Node } from '@/common/interfaces';
import { ItemState } from '@/common/constants';
import { guid } from '@/utils';
import { isPlainObject } from 'lodash';

interface DefaultConfig {
  /** 边线类型 */
  edgeType: string;
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
      edgeType: 'flowEdge',
    };
  },
  getEvents() {
    return {
      'node:mouseenter': 'handleNodeMouseEnter',
      'node:mouseleave': 'handleNodeMouseLeave',
      'node:mousedown': 'handleNodeMouseDown',
      'node:drag': 'handleNodeDrag',
      'node:dragend': 'handleNodeDragEnd',
      mousemove: 'handleMouseMove',
      mouseup: 'handleMouseUp',
    };
  },
  handleNodeMouseEnter(e: any) {
    const graph: any = this.graph;
    const sourceNode = e.item;
    const sourceAnchorPoints = sourceNode.getAnchorPoints();

    if (this.graph) {
      this.graph.setItemState(e.item, 'activeAnchorPoints', true);
    }
  },
  handleNodeMouseLeave(e: any) {
    if (this.graph) {
      this.graph.setItemState(e.item, 'active', true);
      this.graph.setItemState(e.item, 'activeAnchorPoints', false);
    }
  },
  handleNodeDrag(e: any) {
    if (this.graph) {
      this.graph.setItemState(e.item, 'activeAnchorPoints', false);
    }
  },
  handleNodeDragEnd(e: any) {
    if (this.graph) {
      this.graph.setItemState(e.item, 'activeAnchorPoints', true);
    }
  },
  handleNodeMouseDown(e: any) {
    const { graph, edgeType } = this;
    const { target, item } = e;
    const sourceNode = e.item as Node;
    const sourceNodeId = sourceNode.getModel().id;
    const sourceAnchorPointIndex = target?.get('anchorPointIndex');

    if (target.get('name') === 'anchorPoint') {
      const model: any = {
        id: guid(),
        type: edgeType,
        source: sourceNodeId,
        sourceAnchor: sourceAnchorPointIndex,
        target: {
          x: e.x,
          y: e.y,
        } as any,
      };
      this.edge = graph?.addItem('edge', model);
      graph?.getNodes().forEach(targetNode => {
        if (targetNode.getModel().id === sourceNodeId) {
          return;
        }
        graph.setItemState(targetNode, ItemState.ActiveAnchorPoints, true);
      });
    }
  },

  isEnabledAnchorPoint(e: any) {
    const { target } = e;
    return (
      !!target.get('isAnchorPoint') &&
      target.get('anchorPointState') === 'enabled'
    );
  },

  isNotSelf(e: any) {
    const { edge } = this;
    const { item } = e;
    return item.getModel().id !== edge.getSource().getModel().id;
  },

  canFindTargetAnchorPoint(e: any) {
    return this.isEnabledAnchorPoint(e) && this.isNotSelf(e);
  },

  handleMouseMove(e: any) {
    const { graph, edge } = this;

    if (!edge) {
      return;
    }

    if (graph) {
      if (this.canFindTargetAnchorPoint(e)) {
        const { item, target } = e;
        const targetId = item.getModel().id;
        const targetAnchor = target.get('anchorPointIndex');
        graph.updateItem(edge, {
          target: targetId,
          targetAnchor,
        });
      } else {
        graph.updateItem(edge, {
          target: {
            x: e.x,
            y: e.y,
          } as any,
          targetAnchor: undefined,
        });
      }
    }
  },
  shouldAddRealEdge() {
    const { edge } = this;

    if (!edge) {
      return false;
    }

    const target = edge.getTarget();

    return !isPlainObject(target);
  },
  handleMouseUp() {
    const { graph, edge } = this;

    if (!edge) {
      return;
    }

    if (!this.shouldAddRealEdge()) {
      graph?.removeItem(this.edge);
    }

    graph?.getNodes().forEach(targetNode => {
      graph.setItemState(targetNode, ItemState.ActiveAnchorPoints, false);
    });

    this.edge = null;
  },
};

behaviorManager.register('drag-add-edge', dragAddEdgeBehavior);
