import 'react-datepicker/dist/react-datepicker.css';// Import CSS for date picker
import './App.css';  // Import custom CSS for the application
import { BrowserRouter, Routes, Route} from 'react-router-dom'; // Import routing components from react-router-dom
import DisplaydataComponent from './Pages/DisplaydataComponent'; // Import DisplaydataComponent for displaying data
import GraphComponent from './Pages/GraphComponent'; // Import GraphComponent for displaying graphs

function App() {
  return (
    <div className="header-margin">
      <BrowserRouter>
      {/* Define routes for the application */}
        <Routes>
          {/* Route for displaying data */}
          <Route path="/" element={<DisplaydataComponent />}>
          </Route>
          {/* Route for displaying graphs */}
          <Route path="/graph" element={<GraphComponent />}>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
