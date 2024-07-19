import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Form } from "react-bootstrap";
import Chart from "chart.js/auto";

const DashboardComponent = () => {
  const chartRef = useRef(null); // Reference to the chart canvas element
  const [chartInstance, setChartInstance] = useState(null);// State to store the chart instance
  const [chartData, setChartData] = useState({// State to store the chart data
    labels: [],
    datasets: [
      {
        label: "Rejected",
        data: [],
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
      {
        label: "Approved",
        data: [],
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: "Pending",
        data: [],
        backgroundColor: "rgba(255, 205, 86, 0.2)",
        borderColor: "rgba(255, 205, 86, 1)",
        borderWidth: 1,
      },
      {
        label: "Connection Released",
        data: [],
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
    ],
  });
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // State to store the selected year
  const [selectedStatus, setSelectedStatus] = useState("all"); // State to store the selected status, default to 'all'

  useEffect(() => {
    fetchData();// Fetch data when the component mounts or when selectedYear or selectedStatus changes
  }, [selectedYear, selectedStatus]);

  // Function to fetch data from the server
  const fetchData = () => {
    axios
      .get("http://127.0.0.1:5000/")
      .then((response) => {
        const data = response.data;
        filterAndProcessData(data);// Filter and process the fetched data
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        // Handle errors here
      });
  };

  // Function to filter and process data based on the selected year and status
  const filterAndProcessData = (data) => {
    let filteredData = data.filter((item) => {
      const yearMatches =
        new Date(item.Date_of_Application).getFullYear() === selectedYear;
      const statusMatches =
        selectedStatus === "all" ||
        item.Status.trim().toLowerCase() === selectedStatus;
      return yearMatches && statusMatches;
    });

    processChartData(filteredData);// Process the filtered data for the chart
  };

  // Function to process data and update chart data
  const processChartData = (data) => {
    const dataByMonth = {
      January: {
        rejected: 0,
        approved: 0,
        pending: 0,
        "connection released": 0,
      },
      February: {
        rejected: 0,
        approved: 0,
        pending: 0,
        "connection released": 0,
      },
      March: { rejected: 0, approved: 0, pending: 0, "connection released": 0 },
      April: { rejected: 0, approved: 0, pending: 0, "connection released": 0 },
      May: { rejected: 0, approved: 0, pending: 0, "connection released": 0 },
      June: { rejected: 0, approved: 0, pending: 0, "connection released": 0 },
      July: { rejected: 0, approved: 0, pending: 0, "connection released": 0 },
      August: {
        rejected: 0,
        approved: 0,
        pending: 0,
        "connection released": 0,
      },
      September: {
        rejected: 0,
        approved: 0,
        pending: 0,
        "connection released": 0,
      },
      October: {
        rejected: 0,
        approved: 0,
        pending: 0,
        "connection released": 0,
      },
      November: {
        rejected: 0,
        approved: 0,
        pending: 0,
        "connection released": 0,
      },
      December: {
        rejected: 0,
        approved: 0,
        pending: 0,
        "connection released": 0,
      },
    };

    data.forEach((item) => {
      const monthIndex = new Date(item.Date_of_Application).getMonth();
      const monthName = Object.keys(dataByMonth)[monthIndex];
      const status = item.Status.trim().toLowerCase();
      if (dataByMonth[monthName]) {
        dataByMonth[monthName][status]++;
      }
    });

    const months = Object.keys(dataByMonth);
    const rejectedData = months.map((month) => dataByMonth[month].rejected);
    const approvedData = months.map((month) => dataByMonth[month].approved);
    const pendingData = months.map((month) => dataByMonth[month].pending);
    const connectionReleasedData = months.map(
      (month) => dataByMonth[month]["connection released"]
    );

    const updatedChartData = {
      labels: months,
      datasets: [
        {
          ...chartData.datasets[0],
          data: rejectedData,
        },
        {
          ...chartData.datasets[1],
          data: approvedData,
        },
        {
          ...chartData.datasets[2],
          data: pendingData,
        },
        {
          ...chartData.datasets[3],
          data: connectionReleasedData,
        },
      ],
    };

    setChartData(updatedChartData); // Update the chart data state
  };

  useEffect(() => {
    if (chartInstance) {
      chartInstance.destroy(); // Destroy the existing chart instance if it exists
    }

    const ctx = chartRef.current.getContext("2d");
    const newChartInstance = new Chart(ctx, {
      type: "bar", // Set the chart type to 'bar'
      data: chartData,
      options: {
        indexAxis: "y", // Set the index axis to 'y'
        plugins: {
          legend: {
            position: "bottom",  // Position the legend at the bottom
          },
        },
        scales: {
          x: {
            stacked: true, // Enable stacking for the x-axis
            beginAtZero: true,  // Begin the x-axis at zero
          },
          y: {
            stacked: true, // Enable stacking for the y-axis
            beginAtZero: true, // Begin the y-axis at zero
            suggestedMin: 0, // Suggest a minimum value of 0 for the y-axis
          },
        },
      },
    });

    setChartInstance(newChartInstance);  // Set the new chart instance

    return () => {
      newChartInstance.destroy();  // Cleanup: Destroy the chart instance when the component unmounts or updates
    };
  }, [chartData]);

  // Handler for changing the selected year
  const handleYearChange = (event) => {
    setSelectedYear(parseInt(event.target.value));
  };

  // Handler for changing the selected status
  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  return (
    <Container>
      <Row className="align-items-center mb-3">
        <Col xs={12} md={6}>
        </Col>
        <Col xs={12} md={3} className="mb-3 mb-md-0">
          <Form.Select value={selectedYear} onChange={handleYearChange}>
            <option value={2024}>2024</option>
            <option value={2023}>2023</option>
            <option value={2022}>2022</option>
            <option value={2021}>2021</option>
            <option value={2020}>2020</option>
          </Form.Select>
        </Col>
        <Col xs={12} md={3}>
          <Form.Select value={selectedStatus} onChange={handleStatusChange}>
            <option value="all">All Statuses</option>
            <option value="rejected">Rejected</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="connection released">Connection Released</option>
          </Form.Select>
        </Col>
      </Row>
      <Row>
        <Col>
          <canvas ref={chartRef} id="myChart" /> {/* Canvas element for the chart */}
        </Col>
      </Row>
    </Container>
  );
};

export default DashboardComponent;  // Export the Dashboard component as the default export