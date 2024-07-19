from flask import Flask, jsonify, request
import pandas as pd
from flask_mysqldb import MySQL
from flask_cors import CORS
import json
from datetime import datetime

app = Flask(__name__)
CORS(app)

# MySQL database configuration
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_PORT'] = 3306
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'your-password'
app.config['MYSQL_DB'] = 'electricity_board'
db = MySQL(app)

# Function to parse a CSV file and convert it into a pandas DataFrame
def parseCSV(filePath):
    col_names = ['ID','Applicant_Name', 'Gender', 'District', 'State', 'Pincode', 'Ownership', 'GovtID_Type', 'ID_Number', 'Category', 'Load_Applied (in KV)', 'Date_of_Application', 'Date_of_Approval', 'Modified_Date', 'Status', 'Reviewer_ID', 'Reviewer_Name', 'Reviewer_Comments']
    csvData = pd.read_csv(filePath, skiprows=1, names=col_names, header=None)
    csvData = csvData.fillna("") # Replace NaN values with empty strings
    print("Parsed csvdata successfully!!! ")
    return csvData

# Function to insert data from a pandas DataFrame into the MySQL database
def insert_into_DB(csvData):
    for row in csvData.iterrows():
        query = 'INSERT INTO User (ID, Applicant_Name, Gender, District, State, Pincode, Ownership, GovtID_Type, ID_Number, Category, Load_Applied, Date_of_Application, Date_of_Approval, Modified_Date, Status, Reviewer_ID, Reviewer_Name, Reviewer_Comments) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)'
        values = (
            row['ID'],row['Applicant_Name'], row['Gender'], row['District'], row['State'], row['Pincode'], row['Ownership'], row['GovtID_Type'], row['ID_Number'], row['Category'], row['Load_Applied (in KV)'], row['Date_of_Application'], row['Date_of_Approval'], row['Modified_Date'], row['Status'], row['Reviewer_ID'], row['Reviewer_Name'], row['Reviewer_Comments']
        )
        cursor = db.connection.cursor()
        cursor.execute(query, values)
        db.connection.commit()
    print("Inserted data from csv to database successfully!!! ")

# Function to format date strings into a specific format
def format_date(date_str):
    if date_str and " " in date_str:
        try:
            date_obj = datetime.strptime(date_str, '%Y-%m-%d %H:%M:%S')
            return date_obj.strftime('%d-%m-%y').lstrip("0").replace("-0", "-")
        except ValueError:
            pass  
    elif date_str:  
        try:
            date_obj = datetime.strptime(date_str, '%Y-%m-%d')
            return date_obj.strftime('%d-%m-%y').lstrip("0").replace("-0", "-")
        except ValueError:
            pass  
    return date_str

# Route to update the database with data received in a POST request
@app.route('/',methods=['POST'])
def update_DB():
    data = request.json
    print(data)
    for date_field in ['Date_of_Application', 'Date_of_Approval', 'Modified_Date']:
        if data.get(date_field):
            data[date_field] = format_date(data.get(date_field))

    query = 'UPDATE User SET Applicant_Name = %s , Gender = %s , District =%s , State =%s , Pincode =%s , Ownership =%s , Category =%s , Load_Applied =%s , Date_of_Approval =%s , Modified_Date =%s , Status =%s , Reviewer_ID =%s , Reviewer_Name =%s , Reviewer_Comments =%s WHERE ID_Number = %s and GovtID_Type = %s and Date_of_Application = %s'
    values = (
            data.get('Applicant_Name'), data.get('Gender'), data.get('District'), data.get('State'), data.get('Pincode'), data.get('Ownership'), data.get('Category'), data.get('Load_Applied'), data.get('Date_of_Approval'), data.get('Modified_Date'), data.get('Status'), data.get('Reviewer_ID'), data.get('Reviewer_Name'), data.get('Reviewer_Comments'), data.get('ID_Number'), data.get('GovtID_Type'), data.get('Date_of_Application')
        )
    cursor = db.connection.cursor()
    cursor.execute(query, values)
    db.connection.commit()
    response = getFromDB()
    return jsonify(getFromDB()), 200

# Function to convert a date string into a datetime object
def convert_to_datetime(date_str):
    try:
        return datetime.strptime(date_str, '%d-%m-%y')
    except ValueError:
        return None

# Route to retrieve data from the database and return it as JSON
@app.route('/', methods=['GET'])
def getFromDB():
    cursor = db.connection.cursor()
    cursor.execute("SELECT * FROM User")
    row_header = [x[0] for x in cursor.description]
    results = cursor.fetchall()
    json_data = []
    for row in results:
        row_dict = dict(zip(row_header, row))
        if 'Date_of_Application' in row_dict and isinstance(row_dict['Date_of_Application'], str):
            row_dict['Date_of_Application'] = convert_to_datetime(row_dict['Date_of_Application'])
        if 'Date_of_Approval' in row_dict and isinstance(row_dict['Date_of_Approval'], str) and row_dict['Date_of_Approval']!='':
            row_dict['Date_of_Approval'] = convert_to_datetime(row_dict['Date_of_Approval'])
        if 'Modified_Date' in row_dict and isinstance(row_dict['Modified_Date'], str):
            row_dict['Modified_Date'] = convert_to_datetime(row_dict['Modified_Date'])
        json_data.append(row_dict)
    return json.dumps(json_data, default=str), 200

if __name__ == "__main__":
    app.run(debug=True)
    # with app.app_context():
        # csvData = parseCSV('./project/electricity_board_case_study.csv')
        # insert_into_DB(csvData)
