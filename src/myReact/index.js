function createElement(type, props, ...children) {
  // Handle functional component.
  // type = (props) => {
  //   return MyReact.createElement(
  //     'div',
  //     { id: 'foo' },
  //     MyReact.createElement('h1', null, 'Hello MyReact')
  //   );
  // };
  if (typeof type === 'function') {
    return type({ children, ...props });
  }

  return {
    type,
    props: {
      ...props,
      children,
    },
  };
}

function render(element, container) {
  const node = createDOMElement(element);
  container.appendChild(node);
}

function createDOMElement(element) {
  if (typeof element === 'string') {
    return document.createTextNode(element);
  }

  const {
    type,
    props: { children, ...attrs },
  } = element;

  const node = document.createElement(type);

  for (const attrName in attrs) {
    const attrValue = attrs[attrName];

    const lowercasedAttrName = attrName.toLowerCase();
    const isAnEvent = attrName.startsWith('on') && lowercasedAttrName in window;
    if (isAnEvent) {
      const event = lowercasedAttrName.slice(2);
      node.addEventListener(event, attrValue);
      continue;
    }

    const _attrName = attrName === 'className' ? 'class' : attrName;
    node.setAttribute(_attrName, attrValue);
  }

  for (const child of children) {
    node.appendChild(createDOMElement(child));
  }

  return node;
}

const MyReact = {
  createElement,
  render,
};

export default MyReact;
