// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './App';
// import { BrowserRouter } from 'react-router-dom';

// const root = ReactDOM.createRoot(
//   document.getElementById('root') as HTMLElement
// );
// root.render(
//   <React.StrictMode>
//     <BrowserRouter
//       basename="/database"
//       future={{
//         v7_startTransition: true,
//         v7_relativeSplatPath: true
//       }}
//     >
//       <App />
//     </BrowserRouter>
//   </React.StrictMode>
// );

import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter, useNavigate } from 'react-router-dom';

function RedirectHandler({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  
  useEffect(() => {
    const redirectPath = sessionStorage.getItem('redirectPath');
    if (redirectPath) {
      sessionStorage.removeItem('redirectPath');
      // Remove /database prefix since basename handles it
      const path = redirectPath.replace('/database', '') || '/';
      console.log('Redirecting to:', path); // Debug log
      navigate(path, { replace: true });
    }
  }, [navigate]);
  
  return <>{children}</>;
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <BrowserRouter
      basename="/database"
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <RedirectHandler>
        <App />
      </RedirectHandler>
    </BrowserRouter>
  </React.StrictMode>
);