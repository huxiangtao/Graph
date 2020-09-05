## Flow

Demo:

```tsx
import React from 'react';
import { Flow } from 'Graph';

const linkData = {
  nodes: [
    {
      id: 'node1',
      label: 'node1',
      x: 100,
      y: 200,
      // 该节点可选的连接点集合，该点有两个可选的连接点
      anchorPoints: [
        [0, 1],
        [0.5, 1],
      ],
      type: 'rect',
    },
    {
      id: 'node2',
      label: 'node2',
      x: 300,
      y: 400,
      // 该节点可选的连接点集合，该点有两个可选的连接点
      anchorPoints: [
        [0.5, 0],
        [1, 0.5],
      ],
      type: 'rect',
    },
  ],
  edges: [
    {
      source: 'node1',
      target: 'node2',
      // 该边连入 source 点的第 0 个 anchorPoint，
      sourceAnchor: 0,
      // 该边连入 target 点的第 0 个 anchorPoint，
      targetAnchor: 0,
      style: {
        endArrow: true,
      },
    },
    {
      source: 'node2',
      target: 'node1',
      // 该边连入 source 点的第 1 个 anchorPoint，
      sourceAnchor: 1,
      // 该边连入 source 点的第 1 个 anchorPoint，
      targetAnchor: 1,
      style: {
        endArrow: true,
      },
    },
  ],
};

export default () => <Flow enableSideBar height={500} width={700} />;
```

More skills for writing demo: https://d.umijs.org/guide/demo-principle
