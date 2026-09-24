import {StrictMode, lazy, Suspense, useEffect, useState} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const AdminApp = lazy(() => import('./admin/AdminApp'));

// Ruteo mínimo: http://localhost:3000/#/admin abre el panel
function Root() {
  const [isAdmin, setIsAdmin] = useState(location.hash.startsWith('#/admin'));
  useEffect(() => {
    const onHash = () => setIsAdmin(location.hash.startsWith('#/admin'));
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  return isAdmin ? <Suspense fallback={null}><AdminApp /></Suspense> : <App />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);
