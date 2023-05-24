class Edge {
  constructor(id, type, source, sourceHandle, target, targetHandle, style) {
    Object.defineProperties(this, 'id', {
      value: id,
      writrable: false,
    });
    this.type = type;
    this.source = source;
    this.sourceHandle = sourceHandle;
    this.target = target;
    this.targetHandle = targetHandle;
    this.style = style;
  }

  changeProperty(key, value) {
    if (!(key in Object.keys(this)) || key === 'id') {
      return false;
    }
    Reflect.set(this, key, value);
    return true;
  }
}

export default Edge;
