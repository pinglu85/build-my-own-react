import createElement from './createElement';
import createDOM from './createDOM';

let nextUnitOfWork = null;
// wipRoot keeps track of the work-in-progress root of
// the fiber tree.
let wipRoot = null;

// Traverses the fiber tree and appends all nodes
// to the DOM.
function commitRoot() {
  commitWork(wipRoot.child);
  wipRoot = null;
}

function commitWork(fiber) {
  if (!fiber) return;

  const domParent = fiber.parent.dom;
  domParent.appendChild(fiber.dom);

  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

// Creates the root of the fiber tree and
// sets it as the next unit of work.
function render(element, container) {
  wipRoot = {
    dom: container,
    props: {
      children: [element],
    },
  };
  // Set next unit of work.
  nextUnitOfWork = wipRoot;
}

// *** Concurrent Mode ***

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

  // Commit the whole fiber tree to the DOM,
  // if there is no next unit of work and
  // the work-in-progress root exists.
  if (!nextUnitOfWork && wipRoot) {
    commitRoot();
  }

  // Schedule another idle callback.
  requestIdleCallback(workLoop);
}
// `window.requestIdleCallback` queues a function to be called
// when the main thread is idle.
requestIdleCallback(workLoop);

// Performs a unit of work and returns the next unit of work.
// fiber: {
//   type: the type of the node || undefined if the node is the root div.
//   props: { the node's props including its children which are not fiber },
//   parent: the parent of the node, represented as a fiber || undefined
//   child: the node's first child, represented as a fiber || null
//   sibling: the node's first sibling, represented as a fiber || null
//   dom: the actual DOM node || null
// }
function performUnitOfWork(fiber) {
  /* Add the node to the DOM. */

  // Create the actual DOM node
  if (!fiber.dom) fiber.dom = createDOM(fiber);

  // Append the DOM node to its parent DOM node, if the fiber
  // has parent. However, if we append the child node to the
  // DOM now, the user might see an incomplete UI, since the
  // browser can interrupt our rendering.
  // if (fiber.parent) {
  //   fiber.parent.dom.appendChild(fiber.dom);
  // }

  /* Create new fibers from the node's children. */

  const children = fiber.props.children || [];
  let prevSibling = null;

  for (let idx = 0; idx < children.length; idx++) {
    const element = children[idx];
    const newFiber = {
      type: element.type || 'TEXT_ELEMENT',
      props: element.props || { nodeValue: element },
      parent: fiber,
      dom: null,
    };

    if (idx === 0) {
      // Keep track of the first child of the current node.
      fiber.child = newFiber;
    } else {
      // Keep track of each child's first sibling.
      // <div>  <= fiber
      //   <h1></h1>
      //   <img />
      //   <p><p>
      // </div>
      //
      // <h1> --> <img> --> <p>
      //
      // fiber for <h1> = {
      //   type: 'h1',
      //   parent: fiber for <div>,
      //   sibling: fiber for <img>,
      //   ...
      // }
      prevSibling.sibling = newFiber;
    }

    // Update prevSibling
    prevSibling = newFiber;
  }

  /* Return next unit of work. */

  // If the fiber has child, then the next unit of work
  // will be the child.
  if (fiber.child) return fiber.child;

  // If the fiber doesn't have child, then check if it has
  // sibling. If it has, then the sibling will be the next
  // unit of work. Otherwise, go to the parent's sibling. If the
  // parent doesn't have a sibling either, go to its parent's sibling.
  // Keep going up until we find one with a sibling or we reach the root.
  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.parent;
  }

  // If we get out the while loop without returning
  // the next unit of work, then we finish performing
  // all the work for this render.
  return null;
}

const MyReact = {
  createElement,
  render,
};

export default MyReact;
