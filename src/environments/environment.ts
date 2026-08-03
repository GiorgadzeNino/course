/**
 * Firebase web configuration.
 *
 * These values are public by design — they ship inside the browser bundle no
 * matter where they are stored. Access is protected by Firestore Security
 * Rules, not by keeping this config secret.
 */
export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyC6bQLdofUSBk4uGbPF0t28rxrW0fUFqpc',
    authDomain: 'courses-cd807.firebaseapp.com',
    projectId: 'courses-cd807',
    storageBucket: 'courses-cd807.firebasestorage.app',
    messagingSenderId: '338540305062',
    appId: '1:338540305062:web:70299620c4b20068b17267',
  },
};
