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

import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter, useNavigate } from 'react-router-dom';

function RedirectHandler({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(() => {
    // Check immediately on mount
    return !!sessionStorage.getItem('redirectPath');
  });
  
  useEffect(() => {
    const redirectPath = sessionStorage.getItem('redirectPath');
    if (redirectPath) {
      sessionStorage.removeItem('redirectPath');
      const path = redirectPath.replace('/database', '') || '/';
      
      // Navigate immediately
      navigate(path, { replace: true });
      setIsChecking(false);
    }
  }, [navigate]);
  
  // Block rendering until redirect check is complete
  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }
  
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