import React from 'react';
import SideItem from './sideItem';
import { map, merge, clone, includes } from 'lodash';
import { convertObjToString } from '@/utils';
import { GraphContext } from '@/core/GraphContext';

interface SideBarWithContextProps {
  height: number;
  setMode(mode: string): void;
}

interface SideBarProps extends Partial<SideBarWithContextProps> {
  height: number;
}

interface SideBarState {}

let len = 20;
const list: any[] = [];
while (len > 0) {
  list.push({ name: `elliot${len}`, age: 10 + len });
  len--;
}

class SideBar extends React.Component<SideBarWithContextProps, SideBarState> {
  constructor(props: SideBarWithContextProps) {
    super(props);
    this.movePanelRef = React.createRef();
    this.movePanelStyle = {
      visibility: 'hidden',
      display: 'block',
      height: `${props.height}px`,
      width: '180px',
      position: 'absolute',
      overflow: 'hidden',
    };
  }
  movePanelRef: any = null;
  movePanelStyle: any = {};

  pageX: number = 0;
  pageY: number = 0;
  itemX: number = 0;
  itemY: number = 0;

  onItemSelect = (x: number, y: number, pageX: number, pageY: number) => {
    this.updateMovePanelStyle({
      visibility: 'visible',
    });

    this.itemX = x;
    this.itemY = y;
    this.pageX = pageX;
    this.pageY = pageY;
  };

  onMouseMove = (e: any) => {
    if (this.movePanelStyle.visibility === 'visible') {
      const disX = e.pageX - this.pageX;
      const disY = e.pageY - this.pageY;
      this.pageX = e.pageX;
      this.pageY = e.pageY;
      const nextItemX = this.itemX + disX;
      const nextItemY = this.itemY + disY;
      this.itemX = nextItemX;
      this.itemY = nextItemY;
      document
        .getElementById('dragImg')
        ?.setAttribute(
          'style',
          `position: absolute;z-index: 1000;top: 10px; left: 20px;left: ${nextItemX}px; top: ${nextItemY}px; width: 90px; height: 30px;display: block; background: green; z-index: 10000;`,
        );
    }
  };

  updateMovePanelStyle = (newStyle: any) => {
    const nextPanelStyle = merge(clone(this.movePanelStyle), newStyle);
    this.movePanelRef.current.setAttribute(
      'style',
      convertObjToString(nextPanelStyle),
    );
    this.movePanelStyle = nextPanelStyle;
    return nextPanelStyle;
  };

  onMouseLeave = () => {
    this.updateMovePanelStyle({
      visibility: 'hidden',
    });
    // 当元素被真正拖出菜单后，才会切换模式
    // if (this.itemX >= 120) {
    //   console.log('checkPoint');
    //   onCheckPoint(true);
    // } else {
    //   onCheckPoint(false);
    // }
  };

  onCheckPoint = (flag: boolean) => {
    if (flag && this.props.setMode) {
      this.props.setMode('addNode');
    }
  };

  onMouseUp = (e: any) => {
    this.updateMovePanelStyle({
      visibility: 'hidden',
    });
  };

  render() {
    const { height } = this.props;
    return (
      <div>
        <div style={{ position: 'relative', height, width: '180px' }}>
          <div
            className="sideBar"
            style={{
              height,
              width: '180px',
              position: 'absolute',
              background: '#666',
              overflowY: 'scroll',
              padding: '10px',
            }}
          >
            {map(list, item => (
              <SideItem
                key={item.name}
                name={item.name}
                onCheckPoint={this.onCheckPoint}
                age={item.age}
                onItemSelect={this.onItemSelect}
                onMouseUp={this.onMouseUp}
              />
            ))}
          </div>
          <div
            id="move-panel"
            onMouseUp={this.onMouseUp}
            onMouseLeave={this.onMouseLeave}
            ref={this.movePanelRef}
            onMouseMove={this.onMouseMove}
            style={this.movePanelStyle}
          >
            <div
              className="mask"
              style={{
                display: 'block',
                height,
                width: '180px',
                position: 'absolute',
                background: 'red',
                opacity: 0.4,
              }}
            ></div>
          </div>
        </div>
      </div>
    );
  }
}

export default (props: SideBarProps) => {
  return (
    <GraphContext.Consumer>
      {context => <SideBar {...props} {...context} />}
    </GraphContext.Consumer>
  );
};
