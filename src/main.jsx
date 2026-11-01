import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App.jsx';
import { pillars } from './data/content.js';
import './styles/global.css';

// Old links like bhumaji.com/#service-cloud now live at their own page.
const legacy = pillars.find((p) => `#${p.route}` === window.location.hash);
if (legacy) {
  window.location.replace(legacy.path);
} else {
  const root = document.getElementById('root');
  const app = (
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  // Built pages arrive pre-rendered; the dev server starts with an empty root.
  if (root.hasChildNodes()) hydrateRoot(root, app);
  else createRoot(root).render(app);
}
