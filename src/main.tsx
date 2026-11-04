import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { matchRoute } from './routes';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Could not find root element to mount to');
}

const route = matchRoute(window.location.pathname);

if (route.kind === 'home') {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  // The blog, MDX and its explorables load only on blog pages.
  void import('./blog/client').then(({ mountBlog }) => mountBlog(rootElement, route));
}
