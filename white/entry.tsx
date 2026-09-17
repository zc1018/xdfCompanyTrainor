import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import App from './src/App';
import './src/index.css';

// Restore direct section links after the archived React page has mounted.
function InitialAnchor() {
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView({ block: 'start', behavior: 'instant' });
    });
    return () => cancelAnimationFrame(frame);
  }, []);
  return null;
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><App /><InitialAnchor /></React.StrictMode>);
