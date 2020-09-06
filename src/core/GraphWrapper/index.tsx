import React from 'react';
import { GraphContext } from '@/core/GraphContext';
import { Graph } from '@/common/interfaces';

interface GraphWrapperProps {}
interface GraphWrapperState {
  graph: Graph | null;
}
class GraphWrapper extends React.Component<
  GraphWrapperProps,
  GraphWrapperState
> {
  constructor(props: GraphWrapperProps) {
    super(props);
    this.state = {
      graph: null,
    };
  }
  setGraph = (graph: Graph) => {
    this.setState({ graph });
  };
  setMode = (mode: string) => {
    const { graph } = this.state;
    graph && graph.setMode(mode);
  };
  render() {
    const { setGraph, setMode } = this;
    const { children } = this.props;
    const { graph } = this.state;
    return (
      <GraphContext.Provider value={{ setGraph, graph, setMode }}>
        {children}
      </GraphContext.Provider>
    );
  }
}

export default GraphWrapper;
