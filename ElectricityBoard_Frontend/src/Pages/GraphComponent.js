import { useNavigate, useLocation } from "react-router-dom"; // Import hooks from react-router-dom for navigation and location
import DashboardComponent from "./DashboardComponent";  // Import DashboardComponent for displaying the dashboard
import { Button } from 'react-bootstrap';  // Import Button component from react-bootstrap

export default function GraphComponent() {

    const navigate = useNavigate(); // Initialize useNavigate hook for navigation

    // Function to navigate to the home page
    const home = () => {
        navigate("/");  // Navigate to the root path
    };

    return (
        <div>
             {/* Layout for the graph section */}
            <div className="graph-layout">
                {/* Button to navigate back to home */}
                <Button className="graph-button" variant="outline-primary" size="sm" onClick={home}>Back to Home</Button>,
            </div>
            {/* Section title */}
            <div className="display-layout">Users Connection Requests</div>
            {/* Render the DashboardComponent */}
            <DashboardComponent />
        </div>
    )
}
