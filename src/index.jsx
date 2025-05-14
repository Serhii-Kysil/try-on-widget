import React from 'react';
import { createRoot } from 'react-dom/client';
import Widget from './Widget';

function mount(container) {
  if (!container.__mounted__) {
    const root = createRoot(container);
    root.render(<Widget />);
    container.__mounted__ = true;
  }
}

function mountAll() {
  document.querySelectorAll('div[data-try-on-id]').forEach(mount);
}

function startObserver() {
  const observer = new MutationObserver(mountAll);
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

if (document.readyState !== 'loading') {
  mountAll();
  startObserver();
} else {
  document.addEventListener('DOMContentLoaded', () => {
    mountAll();
    startObserver();
  });
}
