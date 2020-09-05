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
          x: e.x - 60,
          y: e.y - 30,
          width: 120,
          height: 60,
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
        x: e.x - 60,
        y: e.y - 30,
      });
      graph.paint();
    }
  },
  handleMouseUp(e: any) {
    const { graph } = this;
    const { width, height } = this.curShape.getBBox();
    this.curShape.remove(true);
    if (graph) {
      const id = Date.now().toString();
      const model = {
        id,
        label: 'node',
        type: 'flowNode',
        x: e.x - width / 2,
        y: e.y - height / 2,
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
