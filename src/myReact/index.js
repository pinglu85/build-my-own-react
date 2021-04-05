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
    // The problem with this recursive call is once we start rendering,
    // we won't stop until we have rendered the entire element tree.
    // If the element tree is big, it may block the main thread for
    // too long. And if the browser needs to do high priority stuff
    // like handling user input or keep an animation smooth, it will
    // have to wait until the render finishes.
    render(child, dom);
  }

  container.appendChild(dom);
}

// *** Concurrent Mode ***

let nextUnitOfWork = null;

// Idle callback handler. It gets called when the browser determines
// there's enough idle time available to let us do some work.
// The callback will receives a `deadline` parameter from `requestIdleCallback`,
// which can be used to check how much time we have until the browser needs
// to take control again.
function workLoop(deadline) {
  let shouldYield = false;
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    // Check is there's time left.
    shouldYield = deadline.timeRemaining() < 1;
  }
  // Schedule another idle callback.
  requestIdleCallback(workLoop);
}
// `window.requestIdleCallback` queues a function to be called
// when the main thread is idle.
requestIdleCallback(workLoop);

// Performs a unit of work and returns the next unit of work.
function performUnitOfWork(nextUnitOfWork) {
  // to do
}

const MyReact = {
  createElement,
  render,
};

export default MyReact;
