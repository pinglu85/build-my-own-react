// Creates a DOM node from fiber.
function createDOM(fiber) {
  const { type, props } = fiber;

  if (type === 'TEXT_ELEMENT') {
    return document.createTextNode(props.nodeValue);
  }

  const dom = document.createElement(type);

  for (const propName in props) {
    if (propName === 'children') continue;

    const propValue = props[propName];

    const lowercasedPropName = propName.toLowerCase();
    const isAnEvent = propName.startsWith('on') && lowercasedPropName in window;
    if (isAnEvent) {
      const eventName = lowercasedPropName.slice(2);
      dom.addEventListener(eventName, propValue);
      continue;
    }

    const _propName = propName === 'className' ? 'class' : propName;
    dom.setAttribute(_propName, propValue);
  }

  return dom;
}
