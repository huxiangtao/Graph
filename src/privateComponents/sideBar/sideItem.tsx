import React from 'react';
import domtoimage from 'dom-to-image';
import { removeAllChildNodes } from '@/utils';

interface SideItemProps {
  name: string;
  age: number;
  onItemSelect: (x: number, y: number, pageX: number, pageY: number) => void;
  onMouseUp: (e: any) => void;
  onCheckPoint: (n: boolean) => void;
}

interface SideItemState {}

class SideItem extends React.Component<SideItemProps, SideItemState> {
  onMouseDown = (e: any) => {
    //removeAllChildNodes(document.getElementById('move-panel'));
    this.props.onCheckPoint(true);
    const imgDom = document.getElementById('dragImg');
    if (imgDom) {
      const parent = imgDom.parentElement;
      parent?.removeChild(imgDom);
    }
    const { onItemSelect } = this.props;
    const x = e.target.offsetLeft;
    const y = e.target.offsetTop - e.target.offsetParent.scrollTop;
    onItemSelect(x, y, e.pageX, e.pageY);
    domtoimage
      .toPng(e.target)
      .then((dataUrl: any) => {
        const img = new Image();
        const elem = document.createElement('div');
        img.src = dataUrl;
        const styleObj = {};
        elem.setAttribute(
          'style',
          `position: absolute;z-index: 1000;top: 10px; left: 20px;left: ${x}px; top: ${y}px; width: 90px; height: 30px;display: block; z-index: 10000;`,
        );
        elem.setAttribute('id', 'dragImg');
        document.getElementById('move-panel')?.prepend(elem);
        elem.appendChild(img);
      })
      .catch(function(error: any) {
        console.error('oops, something went wrong!', error);
      });
  };

  onMouseUp = (e: any) => {
    const imgDom = document.getElementById('dragImg');
    if (imgDom) {
      const parent = imgDom.parentElement;
      parent?.removeChild(imgDom);
    }
    this.props.onMouseUp(e);
  };

  render() {
    const { name, age } = this.props;
    return (
      <div
        className="side-item"
        style={{
          display: 'flex',
          height: '30px',
          width: '90px',
          background: '#eee',
          marginBottom: '10px',
        }}
        onMouseDown={this.onMouseDown}
        onMouseUp={this.onMouseUp}
      >
        <h4 style={{ marginRight: '10px' }}>{name}</h4>
        <p>{age}</p>
      </div>
    );
  }
}

export default SideItem;
