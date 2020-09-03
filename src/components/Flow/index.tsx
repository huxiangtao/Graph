import React from 'react';
import { GraphOptions, GraphData } from '@antv/g6/lib/types';
import G6 from '@antv/g6';
import { Graph } from '@antv/g6';
import SideBar from '@/internalComponents/sideBar';
import { merge } from 'lodash';
import behaviorManager from '@/common/behaviorManager';
//import './behavior/dragAddEdge';
import './behavior/dragAddNode';

interface FlowProps {
  graphConfig?: Partial<GraphOptions>;
  enableSideBar?: boolean;
  width: number;
  height: number;
  data: GraphData;
}

interface FlowState {
  addItem: boolean;
}

class Flow extends React.Component<FlowProps, FlowState> {
  static defaultProps = {
    graphConfig: {},
  };

  state = {
    addItem: false,
  };

  graph: Graph | null = null;

  componentDidMount() {
    this.graph = this.initGraph();
    this.graph.setMode('default');
  }

  initGraph = () => {
    const { graphConfig, data, width, height } = this.props;
    const grid = new G6.Grid();
    const minimap = new G6.Minimap();
    const defaultModes: any = {
      default: {
        'drag-canvas': 'drag-canvas',
        'brush-select': 'brush-select',
        'zoom-canvas': 'zoom-canvas',
        'drag-node': 'drag-node',
        tooltip: {
          type: 'tooltip',
          formatText(model: any) {
            // 提示框文本内容
            const text =
              'label: ' + model.label + '<br/> class: ' + model.class;
            return text;
          },
        },
      },
    };

    const modes = merge(defaultModes, behaviorManager.getRegisteredBehaviors());

    this.graph = new G6.Graph({
      container: 'mountNode',
      width,
      height,
      modes,
      defaultNode: {
        type: 'bizFlowNode',
      },
      defaultEdge: {
        type: 'bizFlowEdge',
      },
      plugins: [grid, minimap],
      ...graphConfig,
    });

    this.graph.data(data);
    this.graph.render();
    return this.graph;
  };

  onCheckPoint = (flag: boolean) => {
    if (flag && this.graph) {
      this.graph.setMode('addNode');
    } else if (!flag && this.graph) {
      this.graph.setMode('default');
    }
  };

  render() {
    const { enableSideBar, height } = this.props;
    return (
      <div id="Flow" style={{ display: 'flex' }}>
        {enableSideBar && (
          <SideBar
            height={height}
            onCheckPoint={this.onCheckPoint}
            graph={this.graph}
          />
        )}
        <div id="mountNode" style={{ position: 'relative' }}></div>
      </div>
    );
  }
}

export default Flow;
