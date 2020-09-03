import { INode, IEdge } from '@antv/g6/lib/interface/item';
import behaviorManager from '@/common/behaviorManager';
import { Behavior, GGroup } from '@/common/interfaces';

interface DefaultConfig {
  multiple: boolean;
}

interface DragAddNodeBehavior {
  edge: IEdge | null;
}

const dragAddNodeBehavior: Behavior = {
  curItem: null,
  curShape: null,
  graphMode: 'addNode',
  getDefaultCfg(): DefaultConfig {
    return {
      multiple: true,
    };
  },
  getEvents() {
    return {
      'canvas:mouseenter': 'handleCanvasMouseEnter',
      mouseup: 'handleMouseUp',
      mousemove: 'handleMouseMove',
    };
  },

  handleCanvasMouseEnter(e: any) {
    const { graph, curShape } = this;

    if (curShape) {
      return;
    }

    if (graph) {
      const group: GGroup = graph.get('group');

      this.curShape = group.addShape('rect', {
        attrs: {
          x: e.x - 25,
          y: e.y - 25,
          width: 50,
          height: 50,
          fill: '#f3f9ff',
          fillOpacity: 0.5,
          stroke: '#1890ff',
          strokeOpacity: 0.9,
          lineDash: [5, 5],
        },
      });

      graph.paint();
    }
  },
  handleMouseMove(e: any) {
    const { graph } = this;
    if (graph) {
      this.curShape.attr({
        x: e.x - 25,
        y: e.y - 25,
      });
      graph.paint();
    }
  },
  handleMouseUp(e: any) {
    const { graph } = this;
    this.curShape.remove(true);
    if (graph) {
      const id = Date.now().toString();
      const model = {
        id,
        label: 'node',
        type: 'ellipse',
        address: 'cq',
        x: e.x,
        y: e.y,
        style: {
          fill: 'blue',
        },
      };
      graph.addItem('node', model);
      graph.setMode('default');
    }
  },
};

behaviorManager.register('drag-add-node', dragAddNodeBehavior);
