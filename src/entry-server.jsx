// Build-time entry: renders each page to HTML (see scripts/prerender.mjs).
import React from 'react';
import { renderToString } from 'react-dom/server';
import App from './App.jsx';

export { routes, headTags } from './seo.js';

export function render(path) {
  return renderToString(
    <React.StrictMode>
      <App initialPath={path} />
    </React.StrictMode>
  );
}
