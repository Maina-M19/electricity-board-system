import React from 'react';  // Import React
import ReactDOM from 'react-dom/client';  // Import ReactDOM for rendering
import 'bootstrap/dist/css/bootstrap.min.css';  // Import Bootstrap CSS for styling
import './index.css';  // Import custom CSS for the application
import App from './App';  // Import the main App component
import HeaderComponent from './HeaderComponent';  // Import the HeaderComponent

// Create a root for rendering the React application
const root = ReactDOM.createRoot(document.getElementById('root'));
// Render the application
root.render(
  <React.StrictMode>
    {/* Render the HeaderComponent */}
    <HeaderComponent/>
    {/* Render the main App component */}
    <App />
  </React.StrictMode>
);

