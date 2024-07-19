import React, { useState, useEffect } from 'react';
import { Modal, Button,Col,Row,Form } from 'react-bootstrap';
import './ModalComponent.scss';  // Import custom styles for the modal
import axios from "axios";  // Import axios for making HTTP requests
import DatePicker from 'react-datepicker';  // Import DatePicker component
import 'react-datepicker/dist/react-datepicker.css';  // Import DatePicker styles
import { formatInTimeZone, toDate, fromZonedTime } from 'date-fns-tz';  // Import date-fns-tz functions for time zone handling

function ModalComponent({ show, handleClose, data, refreshData }) {
  const [isEditing, setIsEditing] = useState(false);  // State to control edit mode
  const [modalData, setModalData] = useState(data);  // State to store modal data
  const [alertMessage, setalertMessage] = useState();  // State to store alert messages

  // Function to update data via a POST request
  const updateData = async (data) => {
    try {
        const response = await axios.post('http://localhost:5000/', data, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        setalertMessage("Updated Successfully!!");  // Set success message
        refreshData();  // Refresh data after update
    } catch (error) {
        console.error('Error:', error);
    }
};

  // Handler for saving edited data
  const handleSave = () =>{
    setIsEditing(false);
    console.log("modalData",modalData);
    updateData(modalData)
  }

  // Handler for enabling edit mode
  const handleEdit = () => {
    console.log(data)
    setIsEditing(true);
  };

  // Handler for closing the modal
  const handleCloseModal = () => {
    setIsEditing(false);
    setalertMessage("");
    handleClose();
  };

  // Handler for validating and updating Load Applied field
  const handleValidation=(e) =>{
    let loadValue = e.target.value;
    if (loadValue >200 || loadValue <0)
    {
      setalertMessage("Load applied should not be less than 0 KV or exceed 200 KV")
    }
    else{
      setalertMessage("");
      setModalData({ ...modalData, Load_Applied: e.target.value })
    }
    } 

  // Effect to update modal data when the passed data changes
  useEffect(() => {
    setModalData(data || {});
  }, [data]);

  // Handler for date change with time zone formatting
  const handleDateChange = (field, date) => {
    const timeZone = 'Asia/Kolkata';
    const zonedDate = formatInTimeZone(date, timeZone, 'yyyy-MM-dd');
    setModalData({ ...modalData, [field]: zonedDate });
  };

  // Function to format date for the DatePicker component
  const formatDateForPicker = (date) => {
    const timeZone = 'Asia/Kolkata';
    return date ? fromZonedTime(toDate(new Date(date), timeZone), timeZone) : null;
  };

  return (
    <Modal className="modal-xl" show={show} onHide={handleClose} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {data ? (
          <>
            <div>
            <Row>
              <Col md={4} className="form-group">
                <Form.Label>ID</Form.Label>
                <Form.Control value={data.ID} disabled />
              </Col>
              <Col md={4} className="form-group">
                <Form.Label>Applicant Name</Form.Label>
                <Form.Control value={modalData.Applicant_Name || ''}
                    onChange={(e) => setModalData({ ...modalData, Applicant_Name: e.target.value })} disabled ={!isEditing}/>
              </Col>
              <Col md={4} className="form-group">
                <Form.Label>Gender</Form.Label>
                <Form.Control value={modalData.Gender || ''}
                    onChange={(e) => setModalData({ ...modalData, Gender: e.target.value })} disabled ={!isEditing} />
              </Col>
            </Row>
            <Row>
              <Col md={4} className="form-group">
                <Form.Label>District</Form.Label>
                <Form.Control value={modalData.District || ''}
                    onChange={(e) => setModalData({ ...modalData, District: e.target.value })} disabled ={!isEditing} />
              </Col>
              <Col md={4} className="form-group">
                <Form.Label>State</Form.Label>
                <Form.Control value={modalData.State || ''}
                    onChange={(e) => setModalData({ ...modalData, State: e.target.value })} disabled ={!isEditing} />
              </Col>
              <Col md={4} className="form-group">
                <Form.Label>Pincode</Form.Label>
                <Form.Control type="number" value={modalData.Pincode || ''}
                    onChange={(e) => setModalData({ ...modalData, Pincode: e.target.value })} disabled ={!isEditing} />
              </Col>
            </Row>
            <Row>
              <Col md={4} className="form-group">
                <Form.Label>Ownership</Form.Label>
                <Form.Control value={modalData.Ownership || ''}
                    onChange={(e) => setModalData({ ...modalData, Ownership: e.target.value })} disabled ={!isEditing} />
              </Col>
              <Col md={4} className="form-group">
                <Form.Label>Govt ID Type</Form.Label>
                <Form.Control value={data.GovtID_Type} disabled />
              </Col>
              <Col md={4} className="form-group">
                <Form.Label>ID Number</Form.Label>
                <Form.Control value={data.ID_Number} disabled />
              </Col>
            </Row>
            <Row>
              <Col md={4} className="form-group">
                <Form.Label>Category</Form.Label>
                <Form.Control value={modalData.Category || ''}
                    onChange={(e) => setModalData({ ...modalData, Category: e.target.value })} disabled ={!isEditing} />
              </Col>
              <Col md={4} className="form-group">
                <Form.Label>Load Applied (in kV)</Form.Label>
                
                <Form.Control type="number" value={modalData.Load_Applied || ''}
                    onChange={handleValidation} disabled ={!isEditing} />
              </Col>
              <Col md={4} className="form-group">
                <Form.Label>Date of Application</Form.Label>
                <div>
                <DatePicker
                    selected={formatDateForPicker(modalData.Date_of_Application)}
                    dateFormat="dd-MM-yyyy"
                    disabled
                    className="form-control date-width"
                  />
                  </div>
              </Col>
            </Row>
            <Row>
              <Col md={4} className="form-group">
                <Form.Label>Date of Approval</Form.Label>
                <div>
                <DatePicker
                    selected={formatDateForPicker(modalData.Date_of_Approval)}
                    onChange={(date) => handleDateChange('Date_of_Approval', date)}
                    dateFormat="dd-MM-yyyy"
                    disabled={!isEditing}
                    className="form-control date-width"
                  />
                  </div>
              </Col>
              <Col md={4} className="form-group">
                <Form.Label>Modified Date</Form.Label>
                <div>
                <DatePicker
                className="form-control date-width"
                    selected={formatDateForPicker(modalData.Modified_Date)}
                    onChange={(date) => handleDateChange('Modified_Date', date)}
                    dateFormat="dd-MM-yyyy"
                    disabled={!isEditing}
                  />
                  </div>
              </Col>
              <Col md={4} className="form-group">
                <Form.Label>Status</Form.Label>
                <Form.Control value={modalData.Status || ''}
                    onChange={(e) => setModalData({ ...modalData, Status: e.target.value })} disabled ={!isEditing} />
              </Col>
            </Row>
            <Row>
              <Col md={4} className="form-group">
                <Form.Label>Reviewer ID</Form.Label>
                <Form.Control value={modalData.Reviewer_ID || ''}
                    onChange={(e) => setModalData({ ...modalData, Reviewer_ID: e.target.value })} disabled ={!isEditing} />
              </Col>
              <Col md={4} className="form-group">
                <Form.Label>Reviewer Name</Form.Label>
                <Form.Control value={modalData.Reviewer_Name || ''}
                    onChange={(e) => setModalData({ ...modalData, Reviewer_Name: e.target.value })} disabled ={!isEditing} />
              </Col>
              <Col md={4} className="form-group">
                <Form.Label>Reviewer Comments</Form.Label>
                <Form.Control value={modalData.Reviewer_Comments || ''}
                    onChange={(e) => setModalData({ ...modalData, Reviewer_Comments: e.target.value })} disabled ={!isEditing} />
              </Col>
            </Row>
            </div>
            <hr></hr>
            <span className={!isEditing ?"banner-color-green" : "banner-color-red"}>
              {alertMessage}
            </span>
          </>
        ) : (
          <p>No data available</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal}>
          Close
        </Button>
        <Button variant="primary" onClick={isEditing? handleSave :handleEdit}>
          {isEditing ? 'Save' : 'Edit'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalComponent;  // Export the ModalComponent as the default export