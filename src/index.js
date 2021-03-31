import MyReact from './myReact';

/** @jsx MyReact.createElement */
const App = () => (
  <div id="foo">
    <h1>Hello MyReact</h1>
  </div>
);

MyReact.render(<App />, document.getElementById('root'));
