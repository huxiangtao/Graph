import { GShape, CustomEdge } from '@/common/interfaces';
import { ItemState } from '@/common/constants';

import G6 from '@antv/g6';

const flowEdge: any = {
  options: {
    style: {
      stroke: '#ccc1d8',
      lineWidth: 2,
      shadowColor: '',
      shadowBlur: 0,
      radius: 8,
      offset: 24,
      endArrow: {
        path: 'M 0,0 L 4,3 L 4,-3 Z',
      },
    },
    labelCfg: {
      style: {
        fill: '#000000',
        fontSize: 10,
      },
    },
    stateStyles: {
      [ItemState.Selected]: {
        stroke: '#5aaaff',
        shadowColor: '#5aaaff',
        shadowBlur: 24,
      },
      [ItemState.HighLight]: {
        stroke: '#5aaaff',
        shadowColor: '#5aaaff',
        shadowBlur: 24,
      },
    },
  },
  setState(name: string, value: boolean | string, item: any) {
    const shape: GShape = item.get('keyShape');
    if (!shape) {
      return;
    }

    const { style, stateStyles } = this.options;

    console.log(style, stateStyles, 'sadas');

    const stateStyle = stateStyles[name];

    if (!stateStyle) {
      return;
    }

    if (value) {
      shape.attr({
        ...style,
        ...stateStyle,
      });
    } else {
      shape.attr(style);
    }
  },
};

G6.registerEdge('flowEdge', flowEdge, 'polyline');
