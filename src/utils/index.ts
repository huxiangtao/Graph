import { reduce, forEach } from 'lodash';
export function getElementLeft(element: any) {
  let actualLeft = element.offsetLeft;
  let current = element.offsetParent;

  while (current !== null) {
    actualLeft += current.offsetLeft;
    current = current.offsetParent;
  }

  return actualLeft;
}

export function getElementTop(element: any) {
  let actualTop = element.offsetTop;
  let current = element.offsetParent;

  while (current !== null) {
    actualTop += current.offsetTop;
    current = current.offsetParent;
  }

  return actualTop;
}

export function removeAllChildNodes(parent: any) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

export function convertObjToString(obj: any) {
  return reduce(
    obj,
    (result: string, value: string, key: string) =>
      (result += `${key}: ${value};`),
    '',
  );
}

export function convertStringToObj(obj: string) {
  const result: any = {};
  const objList = obj.split(';');
  forEach(objList, v => {
    const tempList = v.split(':');
    result[tempList[0]] = tempList[1];
  });
  return result;
}

/** 生成唯一标识 */
export function guid() {
  return 'xxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
