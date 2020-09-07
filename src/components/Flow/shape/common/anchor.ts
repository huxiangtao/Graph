import { ItemState } from '@/common/constants';
import { ShapeStyle, NodeModel, Item, Node } from '@/common/interfaces';
import { forEach } from 'lodash';

interface AnchorPointContextProps {
  getAnchorPoints?(model: NodeModel): number[][];
}

type GetAnchorPointStyle = (item: Node, anchorPoint: number[]) => ShapeStyle;

const ANCHOR_POINT_NAME = 'anchorPoint';

const getAnchorPointDefaultStyle: GetAnchorPointStyle = (item, anchorPoint) => {
  const { width, height } = item.getKeyShape().getBBox();

  const [x, y] = anchorPoint;

  return {
    x: width * x,
    y: height * y,
    r: 3,
    lineWidth: 2,
    fill: '#FFFFFF',
    stroke: '#5AAAFF',
    cursor: 'crosshair',
  };
};

function drawAnchorPoints(this: AnchorPointContextProps, item: Node) {
  const group = item.getContainer();
  const model = item.getModel() as NodeModel;
  const anchorPoints = this.getAnchorPoints ? this.getAnchorPoints(model) : [];

  forEach(anchorPoints, (anchorPoint, index) => {
    group.addShape('circle', {
      name: ANCHOR_POINT_NAME,
      attrs: {
        ...getAnchorPointDefaultStyle(item, anchorPoint),
      },
      isAnchorPoint: true,
      anchorPointIndex: index,
      anchorPointState: 'enabled',
    });
  });
}

function removeAnchorPoints(this: AnchorPointContextProps, item: Node) {
  const group = item.getContainer();
  const anchorPoints = group.findAllByName(ANCHOR_POINT_NAME);

  anchorPoints.forEach(anchorPoint => {
    group.removeChild(anchorPoint);
  });
}

function setAnchorPointsState(
  this: AnchorPointContextProps,
  name: string,
  value: string | boolean,
  item: Item,
) {
  if (name !== ItemState.ActiveAnchorPoints) {
    return;
  }

  if (value) {
    drawAnchorPoints.call(this, item as Node);
  } else {
    removeAnchorPoints.call(this, item as Node);
  }
}

export { setAnchorPointsState };
