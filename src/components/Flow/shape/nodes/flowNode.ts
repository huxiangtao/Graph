import G6 from '@antv/g6';
import { merge, isArray, forEach } from 'lodash';
import { ItemState } from '@/common/constants.ts';
import { CustomNode, Item } from '@/common/interfaces';
import { setAnchorPointsState } from '../common/anchor';

const WRAPPER_CLASS_NAME = 'node-wrapper';
const CONTENT_CLASS_NAME = 'node-content';
const LABEL_CLASS_NAME = 'node-label';
const WRAPPER_BORDER_WIDTH = 2;
const WRAPPER_HORIZONTAL_PADDING = 10;

const flowNode: any = {
  options: {
    size: [120, 60],
    wrapperStyle: {
      fill: '#5487ea',
      radius: 8,
    },
    contentStyle: {
      fill: '#ffffff',
      radius: 6,
    },
    labelStyle: {
      fill: '#FB4FA0',
      textAlign: 'center',
      textBaseline: 'middle',
    },
    stateStyles: {
      [ItemState.Active]: {
        wrapperStyle: {},
        contentStyle: {},
        labelStyle: {},
      } as any,
      [ItemState.Selected]: {
        wrapperStyle: {},
        contentStyle: {},
        labelStyle: {},
      } as any,
    },
  },

  getOptions(model: any) {
    return merge({}, this.options, model);
  },

  draw(model: any, group: any) {
    const keyShape = this.drawWrapper(model, group);

    this.drawContent(model, group);
    this.drawLabel(model, group);

    return keyShape;
  },

  drawWrapper(model: any, group: any) {
    const [width, height] = this.getSize(model);

    const { wrapperStyle } = this.getOptions(model);

    // attrs 中 x, y 定义了该节点的内部坐标系原点的坐标，默认为 0 0，左上角为原点
    const shape = group.addShape('rect', {
      className: WRAPPER_CLASS_NAME,
      draggable: true,
      attrs: {
        width,
        height: height + WRAPPER_BORDER_WIDTH * 2,
        ...wrapperStyle,
      },
    });

    return shape;
  },

  drawLabel(model: any, group: any) {
    const [width, height] = this.getSize(model);
    const { labelStyle } = this.getOptions(model);

    group.addShape('text', {
      className: LABEL_CLASS_NAME,
      draggable: true,
      attrs: {
        x: width / 2,
        y: height / 2,
        text: model.label,
        ...labelStyle,
      },
    });
  },

  drawContent(model: any, group: any) {
    const [width, height] = this.getSize(model);
    const { contentStyle } = this.getOptions(model);

    const shape = group.addShape('rect', {
      className: CONTENT_CLASS_NAME,
      draggable: true,
      attrs: {
        x: 0,
        y: 0,
        width,
        height,
        ...contentStyle,
      },
    });

    return shape;
  },

  getSize(model: any) {
    const { size } = this.getOptions(model);

    if (!isArray(size)) {
      return [size, size];
    }

    return size;
  },

  // setState 是响应节点的状态变化，所有的样式变化逻辑都可以在这里定义
  setState(name: string, value: string | boolean, node: Item) {
    const group = node.getContainer();
    const model = node.getModel();
    const states = node.getStates() as any[];
    const classNameList = [
      WRAPPER_CLASS_NAME,
      CONTENT_CLASS_NAME,
      LABEL_CLASS_NAME,
    ];

    forEach(classNameList, (className: string) => {
      const shape = group.findByClassName(className);
      const options = this.getOptions(model);
      const shapeName = className.split('-')[1];
      // 对所有各自对应的 class node ，通过 shape.attr 赋予样式
      shape.attr({
        ...options[`${shapeName}Style`],
      });

      // 由于该方法会捕获所有的状态变化，但是每次只能捕获一次，
      // 这个遍历是将获取的状态所对应的样式直接覆盖原先的样式
      forEach(states, state => {
        if (
          options.stateStyles[state] &&
          options.stateStyles[state][`${shapeName}Style`]
        ) {
          shape.attr({
            ...options.stateStyles[state][`${shapeName}Style`],
          });
        }
      });
    });

    if (this.afterSetState) {
      this.afterSetState(name, value, node);
    }
  },

  afterSetState(name: string, value: string | boolean, node: Item) {
    setAnchorPointsState.call(this, name, value, node);
  },

  getAnchorPoints() {
    return [
      [0.5, 0],
      [0.5, 1],
      [0, 0.5],
      [1, 0.5],
    ];
  },
};

G6.registerNode('flowNode', flowNode);
