
# Electricity Board Data Application

This project is a React-based web application for displaying and managing data related to an electricity board. The application allows users to view data, filter it by date and status, and visualize it in graphs. The backend is powered by Flask and MySQL.

## Features

- Display and filter electricity board data.
- View and edit detailed information in a modal.
- Filter data by date range.
- Visualize data in graphs by date and status.
- Responsive design using Bootstrap.

## Prerequisites

- React (version 18.x or later)
- Node (version 20.x or later)
- npm (version 10.x or later)
- Python (version 3.x)
- Flask (version 3.x)
- MySQL Workbench

## Installation

### Backend Setup

1. **Navigate to backend directory:**

   ```sh
   cd ElectricityBoard_Backend
   ```

2. **Set up a virtual environment and install dependencies:**

   ```sh
   python -m venv venv
   source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
   pip install -r requirements.txt
   ```

3. **Set up MySQL:**

   - Ensure MySQL Workbench is installed and running on your machine.
   - Create a MySQL new Connection provide a name and set the host and port as follow `http://127.0.0.1:3306`.
   - Create a database named `electricity_board`.
   - Update the MySQL configuration in `app.py` with your database credentials.
   
   Note: Make sure the DB is hosted on `127.0.0.1` and listens to port **`3306`**

4. **Run the Flask server:**

   ```sh
   flask run
   ```

   Note: The flask application is now running at `http://127.0.0.1:5000`

### Frontend Setup

1. **Navigate to the frontend directory:**

   ```sh
   cd ElectricityBoard_Frontend
   ```

2. **Install the frontend dependencies:**

   ```sh
   npm install
   ```

3. **Run the React development server:**

   ```sh
   npm start
   ```

## Project Structure
### Frontend 
- `App.js`: Main application component that defines the routes.
- `Dashboard.js`: Component to display the dashboard with charts.
- `GraphComponent.js`: Component to display the graph view.
- `DisplaydataComponent.js`: Component to display and filter data in a table.
- `ModalComponent.js`: Component to display and edit detailed information in a modal.
- `LoaderComponent.js`: Component to display a loading spinner.
- `HeaderComponent.js`: Component to display the header.
- `index.js`: Entry point of the React application.

### Backend 
- `app.py`: Main application component that defines the routes.