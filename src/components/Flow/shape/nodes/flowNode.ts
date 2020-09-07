import G6 from '@antv/g6';
import { merge, isArray, forEach, isEmpty, concat } from 'lodash';
import { ItemState } from '@/common/constants.ts';
import { CustomNode, Item, NodeModel, GGroup } from '@/common/interfaces';
import { setAnchorPointsState } from '../common/anchor';

const WRAPPER_NAME = 'node-wrapper';
const CONTENT_NAME = 'node-content';
const LABEL_NAME = 'node-label';
const PATH_NAME = 'node-path';
const MARK_NAME = 'node-mark';
const RUBBISH_NAME = 'node-rubbish';
const CONFIRM_BUTTON = 'node-confirmbutton';
const CANCEL_BUTTON = 'node-cancelbutton';
import '../css/iconfont.css';

const flowNode: any = {
  options: {
    size: [162, 94],
    wrapperStyle: {
      fill: '#5487ea',
      radius: 5,
      stroke: '#e0dbdb',
      lineWidth: 2,
    },
    contentStyle: {
      fill: '#fff',
      radius: 5,
      cursor: 'grab',
    },
    pathStyle: {
      path: [
        ['M', 0, 57],
        ['L', 162, 57],
      ],
      cursor: 'grab',
      stroke: '#e0dbdb',
      lineWidth: 1,
    },
    labelStyle: {
      fill: '#FB4FA0',
      textAlign: 'center',
      fontSize: 14,
      textBaseline: 'middle',
    },
    rubbishStyle: {
      width: 13,
      height: 13,
      cursor: 'pointer',
      img: 'https://img.icons8.com/android/2x/trash.png',
    },
    stateStyles: {
      [ItemState.Active]: {
        wrapperStyle: {
          stroke: '#5ec1df',
        },
      } as any,
      [ItemState.Selected]: {
        wrapperStyle: {
          stroke: '#5ec1df',
        },
        contentStyle: {
          cursor: 'grabbing',
          fill: '#d7eff6',
        },
        pathStyle: {
          stroke: '#5ec1df',
        },
      },
      [ItemState.ActiveMark]: {
        contentStyle: {
          cursor: 'grabbing',
        },
      },
    },
  },

  getOptions(model: NodeModel) {
    return merge({}, this.options, model);
  },

  draw(model: NodeModel, group: GGroup) {
    const keyShape = this.drawWrapper(model, group);

    this.drawContent(model, group);
    this.drawLabel(model, group);

    this.drawPath(model, group);
    this.drawIconRubbish(model, group);

    return keyShape;
  },

  drawWrapper(model: NodeModel, group: GGroup) {
    const [width, height] = this.getSize(model);

    const { wrapperStyle } = this.getOptions(model);

    // attrs 中 x, y 定义了该节点的内部坐标系原点的坐标，默认为 0 0，左上角为原点
    return group.addShape('rect', {
      name: WRAPPER_NAME,
      draggable: true,
      attrs: {
        width,
        height,
        ...wrapperStyle,
      },
    });
  },

  drawLabel(model: NodeModel, group: GGroup) {
    const [width, height] = this.getSize(model);
    const { labelStyle } = this.getOptions(model);

    group.addShape('text', {
      name: LABEL_NAME,
      draggable: true,
      attrs: {
        x: width / 2,
        y: height / 3.5,
        text: model.label,
        ...labelStyle,
      },
    });
  },

  drawContent(model: NodeModel, group: GGroup) {
    const [width, height] = this.getSize(model);
    const { contentStyle } = this.getOptions(model);

    return group.addShape('rect', {
      name: CONTENT_NAME,
      draggable: true,
      attrs: {
        x: 0,
        y: 0,
        width,
        height,
        ...contentStyle,
      },
    });
  },

  drawPath(model: NodeModel, group: GGroup) {
    const { pathStyle } = this.getOptions(model);
    return group.addShape('path', {
      name: PATH_NAME,
      attrs: pathStyle,
    });
  },

  drawIconRubbish(model: NodeModel, group: GGroup) {
    const [height] = this.getSize(model);
    const { rubbishStyle } = this.getOptions(model);

    return group.addShape('image', {
      name: RUBBISH_NAME,
      draggable: true,
      attrs: {
        x: 10,
        y: height / 2.3,
        ...rubbishStyle,
      },
    });
  },

  drawConfirmButton(model: NodeModel, group: GGroup) {
    const [height] = this.getSize(model);
    return group.addShape('text', {
      draggable: true,
      name: CONFIRM_BUTTON,
      attrs: {
        x: -20,
        y: height / 2,
        text: '确认',
        fill: '#FB4FA0',
        textAlign: 'center',
        fontSize: 12,
        cursor: 'pointer',
        textBaseline: 'middle',
      },
    });
  },

  drawCancelButton(model: NodeModel, group: GGroup) {
    const [height] = this.getSize(model);
    return group.addShape('text', {
      draggable: true,
      name: CANCEL_BUTTON,
      attrs: {
        x: 15,
        y: height / 1.5,
        text: '取消',
        fill: '#FB4FA0',
        textAlign: 'center',
        fontSize: 12,
        cursor: 'pointer',
        textBaseline: 'middle',
      },
    });
  },

  drawMark(group: GGroup) {
    return group.addShape('marker', {
      name: MARK_NAME,
      attrs: {
        x: -10,
        y: -10,
        r: 10,
        fill: 'red',
        symbol: function() {
          return [
            ['M', 0, 0],
            ['L', 15, 0],
            ['L', 12, 2],
            ['L', 2, 2],
            ['L', 2, 12],
            ['L', 0, 15],
            ['Z'],
          ];
        },
      },
    });
  },

  removeMark(group: GGroup) {
    const marks = group.findAllByName(MARK_NAME);
    marks.forEach((mark: any) => {
      group.removeChild(mark);
    });
  },

  removeRubbishButton(group: GGroup) {
    const marks = concat(
      group.findAllByName(CONFIRM_BUTTON),
      group.findAllByName(CANCEL_BUTTON),
    );
    marks.forEach((mark: any) => {
      group.removeChild(mark);
    });
  },

  getSize(model: NodeModel) {
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
    const nameList = [WRAPPER_NAME, CONTENT_NAME, LABEL_NAME, PATH_NAME];

    //console.log(name, value, states, 'set-state');

    if (name === ItemState.ActiveMark) {
      if (value) {
        const item = group.findAllByName(MARK_NAME);
        if (!item || isEmpty(item)) {
          this.drawMark(group);
        }
      } else {
        this.removeMark(group);
      }
    }

    if (name === ItemState.ShowRubbishConfirm) {
      if (value) {
        const item = group.findAllByName(CONFIRM_BUTTON);
        if (!item || isEmpty(item)) {
          this.drawConfirmButton(model, group);
          this.drawCancelButton(model, group);
        }
      } else {
        this.removeRubbishButton(group);
      }
    }

    forEach(nameList, (name: string) => {
      const shapes = group.findAllByName(name);
      const options = this.getOptions(model);
      const shapeName = name.split('-')[1];
      // 对所有各自对应的 name node ，通过 shape.attr 赋予样式
      forEach(shapes, shape => {
        shape.attr({
          ...options[`${shapeName}Style`],
        });
      });

      // 由于该方法会捕获所有的状态变化，但是每次只能捕获一次，
      // 这个遍历是将获取的状态所对应的样式直接覆盖原先的样式
      forEach(states, state => {
        if (
          options.stateStyles[state] &&
          options.stateStyles[state][`${shapeName}Style`]
        ) {
          forEach(shapes, shape => {
            shape.attr({
              ...options.stateStyles[state][`${shapeName}Style`],
            });
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
