import React from 'react';
import { GraphOptions, GraphData } from '@antv/g6/lib/types';
import G6 from '@antv/g6';
import { Graph } from '@antv/g6';
import SideBar from '@/privateComponents/sideBar';
import { merge } from 'lodash';
import BasicGraph from '@/core/BasicGraph';
import behaviorManager from '@/common/behaviorManager';
import './shape/nodes/flowNode';
import './shape/edges/flowEdge';
import './behavior/dragAddEdge';
import './behavior/dragAddNode';

interface FlowProps {
  graphConfig?: Partial<GraphOptions>;
  enableSideBar?: boolean;
  width: number;
  height: number;
  data?: GraphData;
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
      },
    };

    const modes = merge(defaultModes, behaviorManager.getRegisteredBehaviors());

    return new G6.Graph({
      container: 'mountNode',
      width,
      height,
      modes,
      defaultNode: {
        type: 'flowNode',
      },
      defaultEdge: {
        type: 'bizFlowEdge',
      },
      plugins: [grid, minimap],
      ...graphConfig,
    });
  };

  // onCheckPoint = (flag: boolean) => {
  //   if (flag && this.graph) {
  //     this.graph.setMode('addNode');
  //   } else if (!flag && this.graph) {
  //     this.graph.setMode('default');
  //   }
  // };

  render() {
    const { enableSideBar, height } = this.props;
    return (
      <div id="Flow" style={{ display: 'flex' }}>
        {enableSideBar && <SideBar height={height} />}
        <BasicGraph containerId="mountNode" initGraph={this.initGraph} />
      </div>
    );
  }
}

export default Flow;
