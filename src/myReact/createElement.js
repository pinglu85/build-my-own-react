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

export default createElement;
