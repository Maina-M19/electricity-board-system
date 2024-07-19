import React from 'react';  // Import React
import { Spinner } from 'react-bootstrap';  // Import Spinner component from react-bootstrap

const LoaderComponent = () => {
    return (
        // Center the spinner both vertically and horizontally
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
            {/* Display a spinner with a border animation */}
            <Spinner animation="border" role="status">
                {/* Screen reader text for accessibility */}
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        </div>
    );
};

export default LoaderComponent;  // Export the LoaderComponent as the default export