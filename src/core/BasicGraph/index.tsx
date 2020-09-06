import React from 'react';
import { Graph } from '@/common/interfaces';
import { GraphContext } from '@/core/GraphContext';

interface BasicGraphWithContextProps {
  containerId: string;
  initGraph(): Graph;
  setGraph(graph: Graph): void;
}

interface BasicGraphProps extends Partial<BasicGraphWithContextProps> {
  containerId: string;
  initGraph(): Graph;
}

interface BasicGraphState {}

class BasicGraph extends React.Component<
  BasicGraphWithContextProps,
  BasicGraphState
> {
  graph: Graph | null = null;
  componentDidMount() {
    const { initGraph, setGraph } = this.props;
    this.graph = initGraph();
    this.graph.render();
    this.graph.setMode('default');
    setGraph && setGraph(this.graph);
  }
  render() {
    const { containerId } = this.props;
    return <div id={containerId} style={{ position: 'relative' }} />;
  }
}

export default (props: BasicGraphProps) => {
  return (
    <GraphContext.Consumer>
      {context => <BasicGraph {...props} {...context} />}
    </GraphContext.Consumer>
  );
};
