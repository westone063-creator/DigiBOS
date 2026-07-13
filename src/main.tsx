import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';

localStorage.removeItem('logoInstansi');
import './index.css';
import { syncStorageToFirebase, fetchStorageFromFirebase } from './syncStorage';

syncStorageToFirebase();

fetchStorageFromFirebase().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});
