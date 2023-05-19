/* eslint-disable object-curly-newline */
/* eslint-disable no-console */
class NodeRef {
  constructor(
    nodeId,
    position,
    positionAbsolute,
    sourcePosition,
    targetPosition,
    width,
    height,
    style,
  ) {
    this.nodeId = nodeId;
    // 因為直接寫在 Flow 中，不需要另外 Fetch
    this.position = position;
    this.positionAbsolute = positionAbsolute;
    this.sourcePosition = sourcePosition;
    this.targetPosition = targetPosition;
    this.width = width;
    this.height = height;
    this.style = style;
    // 或者使用解構賦值傳遞值
    // const myInstance = new MyClass(...Object.values(myObject));
  }
}

export default NodeRef;
