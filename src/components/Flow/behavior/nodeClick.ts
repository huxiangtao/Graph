import { INode, IEdge } from '@antv/g6/lib/interface/item';
import behaviorManager from '@/common/behaviorManager';
import { Behavior, AnchorPoint, Node } from '@/common/interfaces';
import { ItemState } from '@/common/constants';
import { guid } from '@/utils';
import { isPlainObject, forEach, merge } from 'lodash';

const { Active, ActiveAnchorPoints, ActiveMark, Selected } = ItemState;

interface DefaultConfig {
  /** 边线类型 */
  edgeType: string;
}

interface StateMap {
  [key: string]: boolean | string;
}

interface DragAddEdgeBehavior {
  edge: IEdge | null;
}

const clickNode: Behavior = {
  getEvents() {
    return {
      'node:click': 'handleNodeClick',
    };
  },

  handleNodeClick(e: any) {
    const { target, item } = e;
    const { graph } = this;
    if (target.get('name') === 'node-rubbish') {
      graph?.setItemState(item, 'showRubbishConfirm', true);
    } else {
      if (target.get('name') === 'node-confirmbutton') {
        graph?.removeItem(e.item);
        return;
      }
      graph?.setItemState(item, 'showRubbishConfirm', false);
    }
  },
};

behaviorManager.register('click-node', clickNode);
