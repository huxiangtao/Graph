import React from 'react';
import { Graph } from '@/common/interfaces';
import { GraphContext } from '@/core/GraphContext';

interface BasicGraphWithContextProps {
  containerId: string;
  initGraph(): Graph;
  setGraph(graph: Graph): void;
  data?: any;
}

interface BasicGraphProps extends Partial<BasicGraphWithContextProps> {
  containerId: string;
  initGraph(): Graph;
  data?: any;
}

interface BasicGraphState {}

class BasicGraph extends React.Component<
  BasicGraphWithContextProps,
  BasicGraphState
> {
  componentDidMount() {
    const { initGraph, setGraph, data } = this.props;
    const graph = initGraph();
    if (data) {
      graph.data(data);
    }
    graph.render();
    graph.setMode('default');
    setGraph && setGraph(graph);
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
