import App from './App.tsx';
import React from 'react';
import ReactDOM from 'react-dom/client';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

// eslint-disable-next-line no-console
console.log(`🐇 Build: ${import.meta.env.VITE_VERSION}`);