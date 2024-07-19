import axios from "axios"; // Import axios for making HTTP requests
import { useEffect, useState } from "react";  // Import hooks from React
import DataTable from 'react-data-table-component';  // Import DataTable component
import ModalComponent from './ModalComponent';  // Import custom ModalComponent
import {Button} from 'react-bootstrap';  // Import Button component from react-bootstrap
import DatePicker from 'react-datepicker';  // Import DatePicker component
import LoaderComponent from './LoaderComponent';  // Import custom LoaderComponent
import { useNavigate } from 'react-router-dom';  // Import useNavigate hook from react-router-dom

function DisplaydataComponent(){
    const [data, setData] = useState([]);  // State to store fetched data
    const [filteredData, setFilteredData] = useState([]);  // State to store filtered data
    const [showModal, setShowModal] = useState(false);  // State to control modal visibility
    const [selectedRow, setSelectedRow] = useState(null)  // State to store selected row data
    const [error, setError] = useState(null);  // State to store error messages
    const [startDate, setStartDate] = useState(null);  // State to store start date for date range filter
    const [endDate, setEndDate] = useState(null);  // State to store end date for date range filter
    const [loading, setLoading] = useState(true);  // State to control loading spinner visibility

    const navigate = useNavigate();  // Initialize useNavigate hook for navigation

    // Function to fetch data from the server
    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/');
        setData(response.data);
        setFilteredData(response.data);
      } catch (error) {
        setError(error.message);
      }
      finally {
        setLoading(false);  // Set loading to false after data is fetched
    }
    };
  
    // Fetch data when the component mounts
    useEffect(() => {
      fetchData();
    }, []);

    // Handler for the view button to show modal with row details
    const handleViewButton = (row) => {
      setSelectedRow(row);
      setShowModal(true);
    };

    // Handler to close the modal
    const handleCloseModal = () => {
      setShowModal(false);
      setSelectedRow(null);
    };

    // Define columns for the data table
    const columns = [
        { name: 'Applicant Name', selector: row => row.Applicant_Name, sortable: true },
        { name: 'State', selector: row => row.State, sortable: true },
        { name: 'Pincode', selector: row => row.Pincode, sortable: true },
        { name: 'ID Number', selector: row => row.ID_Number, sortable: true },
        { name: 'Category', selector: row => row.Category, sortable: true },
        { name: 'Load Applied (in KV)', selector: row => row.Load_Applied, sortable: true,center:true},
        { name: 'Date of Application', selector: row => row.Date_of_Application, sortable: true, readOnly:true,cell: row=>(<DatePicker className="form-control no-border" dateFormat="dd-MM-yyyy" disabled selected={row.Date_of_Application} />), disabled:true },
        { name: 'Status', selector: row => row.Status, sortable: true,
          conditionalCellStyles: [
          {
            when: row => row.Status == 'Approved',
            style: {
              backgroundColor:'green'
            },
          },
          {
            when: row => row.Status == 'Pending',
            style: {
              backgroundColor:'yellow'
            },
          },
          {
            when: row => row.Status == 'Connection Released',
            style: {
              backgroundColor:'orange'
            },
          },
          {
            when: row => row.Status == 'Rejected ',
            style: {
              backgroundColor:'red'
            },
          },
        ],},
        { name: 'Reviewer Name', selector: row => row.Reviewer_Name, sortable: true },
        {
          name: '',
          cell: (row) => <Button onClick={() => handleViewButton(row)} variant="outline-primary" size="sm">View/Edit</Button>,
          ignoreRowClick: true,
          allowOverflow: true,
          button: true,
        },
      ];
    
      console.log("Rendered Data:", data);  // Log the rendered data for debugging 

    // Handler for search input to filter data  
    const handleSearch = (e) => {
      const searchValue = e.target.value.toLowerCase();
      if (searchValue === "") {
          setFilteredData(data);  // Reset to original data if search is cleared
      } else {
          const newRows = data.filter((row) => {
              return row.ID_Number.toString().toLowerCase().includes(searchValue);
              // return Object.values(row).some((value)=>value && value.toString().toLowerCase().includes(searchValue));
          });
          setFilteredData(newRows);
      }
  };

    // Handler for date range picker
    const handleDateChange = (dates) => {
      const [start, end] = dates;
      console.log("handleDataChange",start,end);
      setStartDate(start);
      console.log("start",start);
      setEndDate(end);
      console.log("end",end);
      filterDataByDate(start, end);
  };

  // Function to filter data by date range
  const filterDataByDate = (start, end) => {
      if (start && end) {
          const filteredRows = data.filter((row) => {
              const dateOfApplication = new Date(row.Date_of_Application);
              return dateOfApplication >= start && dateOfApplication <= end;
          });
          setFilteredData(filteredRows);
      } else {
          setFilteredData(data);
      }
  };

    // Handler for the graph button to navigate to the graph page
    const handleGraphButtonClick = () => {
      navigate("/graph", { state: { data: filteredData } });
    };

    
      return (
        <div>
          {loading ? (
                <LoaderComponent /> // Show loader while loading
            ) :(
          <div>
            <div className="graph-layout">
            <Button className= "graph-button" onClick={handleGraphButtonClick} variant="outline-primary" size="sm">View Graph</Button>,
            </div>
            <div className="outer-border">
            <input
              type="search"
              className="form-control-sm border ps-3"
              placeholder="Search"
              onChange={handleSearch}
            />
            <DatePicker
            showIcon
              selectsRange
              startDate={startDate}
              endDate={endDate}
              onChange={handleDateChange}
              isClearable
              showYearDropdown
              showMonthDropdown
              scrollableYearDropdown
              minDate={new Date(2020, 0, 1)} // Start year
              maxDate={new Date(2040, 11, 31)} // End year
              className="form-control date-range"
              placeholderText={"Select a date range"}
              dateFormat="dd-MM-yyyy"
            />
            <DataTable
            className="datatable-layout"
              columns={columns}
              data={filteredData}
              pagination
            />
          </div>
          <ModalComponent show={showModal} handleClose={handleCloseModal} data={selectedRow} refreshData={fetchData}/>
        </div>
        )}
      </div>
      );
}

export default DisplaydataComponent;  // Export the DisplaydataComponent as the default export