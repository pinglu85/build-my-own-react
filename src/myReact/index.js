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
  let dom;

  if (typeof element === 'string') {
    dom = document.createTextNode(element);
    container.appendChild(dom);
    return;
  }

  const {
    type,
    props: { children, ...attrs },
  } = element;

  dom = document.createElement(type);

  for (const attrName in attrs) {
    const attrValue = attrs[attrName];

    const lowercasedAttrName = attrName.toLowerCase();
    const isAnEvent = attrName.startsWith('on') && lowercasedAttrName in window;
    if (isAnEvent) {
      const event = lowercasedAttrName.slice(2);
      dom.addEventListener(event, attrValue);
      continue;
    }

    const _attrName = attrName === 'className' ? 'class' : attrName;
    dom.setAttribute(_attrName, attrValue);
  }

  for (const child of children) {
    render(child, dom);
  }

  container.appendChild(dom);
}

const MyReact = {
  createElement,
  render,
};

export default MyReact;
