import React from 'react';
import ReactDOM from 'react-dom/client';
import 'react-toastify/dist/ReactToastify.css';
import './scss/bootstrap.scss';
import './scss/style.scss';
import 'bootstrap/dist/js/bootstrap.bundle';
import 'swiper/swiper-bundle.css';

import App from './App';
import './firebase.config.js';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
