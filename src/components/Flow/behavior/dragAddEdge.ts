import { INode, IEdge } from '@antv/g6/lib/interface/item';
import behaviorManager from '@/common/behaviorManager';
import { Behavior, AnchorPoint, Node } from '@/common/interfaces';
import { ItemState } from '@/common/constants';
import { guid } from '@/utils';
import { isPlainObject, forEach, merge } from 'lodash';

const { Active, ActiveAnchorPoints, ActiveMark, Selected } = ItemState;

interface DefaultConfig {
  /** 边线类型 */
  edgeType: string;
}

interface StateMap {
  [key: string]: boolean | string;
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
      'node:dragstart': 'handleNodeDragStart',
      'node:drag': 'handleNodeDrag',
      'node:dragend': 'handleNodeDragEnd',
      'canvas:drag': 'handleCanvasDrag',
      'canvas:dragend': 'handleCanvasDragEnd',
      mousemove: 'handleMouseMove',
      mouseup: 'handleMouseUp',
    };
  },

  // 批量设置状态值
  setNodeStates(graph: any, item: any, stateMap: StateMap) {
    if (!item || !graph) {
      return;
    }
    forEach(stateMap, (stateValue: boolean | string, key: string) => {
      graph.setItemState(item, key, stateValue);
    });
  },

  handleNodeMouseEnter(e: any) {
    this.setNodeStates(this.graph, e.item, {
      [Active]: true,
      [ActiveAnchorPoints]: true,
    });
  },

  handleNodeMouseLeave(e: any) {
    this.setNodeStates(this.graph, e.item, {
      [Active]: false,
      [ActiveAnchorPoints]: false,
    });
  },

  handleNodeDragStart(e: any) {
    this.setNodeStates(this.graph, e.item, {
      [ActiveMark]: true,
      [Selected]: true,
    });
  },

  handleNodeDrag(e: any) {
    this.setNodeStates(this.graph, e.item, {
      [Selected]: true,
      [ActiveAnchorPoints]: false,
    });
  },

  handleNodeDragEnd(e: any) {
    this.setNodeStates(this.graph, e.item, {
      [Selected]: false,
      [ActiveMark]: false,
      [ActiveAnchorPoints]: true,
    });
  },

  handleCanvasDrag(e: any) {
    const { graph } = this;
    if (graph) {
      graph.get('canvas').get('el').style.cursor = 'all-scroll';
    }
  },

  handleCanvasDragEnd(e: any) {
    const { graph } = this;
    if (graph) {
      graph.get('canvas').get('el').style.cursor = 'default';
    }
  },

  handleNodeMouseDown(e: any) {
    const { graph, edgeType } = this;
    const { target, item } = e;
    const sourceNode = item as Node;
    const sourceNodeId = sourceNode.getModel().id;
    const sourceAnchorPointIndex = target?.get('anchorPointIndex');

    // 当鼠标的目标对象为节点周围的圆点的时候，在画布上添加一条边元素
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
        // 激活其他节点的连接点来指引用户连接
        graph.setItemState(targetNode, ActiveAnchorPoints, true);
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
      graph.setItemState(targetNode, 'dragend', true);
      graph.setItemState(targetNode, ItemState.ActiveAnchorPoints, false);
    });

    this.edge = null;
  },
};

behaviorManager.register('drag-add-edge', dragAddEdgeBehavior);
