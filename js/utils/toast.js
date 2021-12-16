import Toastify from 'toastify-js';

import 'toastify-js/src/toastify.css';
export const toast = {
  info(message) {
    Toastify({
      text: message,
      duration: 3000,
      close: true,
      gravity: 'top', // `top` or `bottom`
      position: 'right', // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: '#0288d1',
      },
    }).showToast();
  },
  success(message) {
    Toastify({
      text: message,
      duration: 3000,
      close: true,
      gravity: 'top', // `top` or `bottom`
      position: 'right', // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: '#2e7d32',
      },
    }).showToast();
  },
  error(message) {
    Toastify({
      text: message,
      duration: 3000,
      close: true,
      gravity: 'top', // `top` or `bottom`
      position: 'right', // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: '#d32f2f',
      },
    }).showToast();
  },
};
