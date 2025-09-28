// src/components/UserForm.js
import React from 'react';
import { Form, Button, Row, Col, Alert, Container } from 'react-bootstrap';

const UserForm = ({
  formData,
  setFormData,
  handleSubmit,
  handleClose,
  error,
  submitted,
  title,
  submitLabel
}) => {
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleFileChange = e => {
    setFormData(prev => ({ ...prev, profilepic: e.target.files[0] }));
  };  

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4" style={{ color: '#2c3e50', fontWeight: '600' }}>{title}</h2>
      {submitted && <Alert variant="success">User information submitted successfully!</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>LoginID</Form.Label>
              <Form.Control type="test" name="loginid" value={formData.loginid} onChange={handleChange} required />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} required />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control type="text" name="fullname" value={formData.fullname} onChange={handleChange} required />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} required />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control type="tel" name="phone_number" value={formData.phone_number} placeholder="0123456789" pattern="[0-9]{10}" onChange={handleChange} required />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="text" name="email" value={formData.email} onChange={handleChange} required />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select name="userrole" value={formData.userrole} onChange={handleChange}>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select name="is_active" value={formData.is_active || 'true'} onChange={handleChange}>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Form.Group controlId="formProfilePicture" className="mb-3">
          <Form.Label>Profile Picture</Form.Label>
          <Form.Control type="file" name="profilepic" onChange={handleFileChange} accept="image/*" />
        </Form.Group>

        <div className="d-flex justify-content-center mt-4 gap-3">
          <Button variant="primary" type="submit">{submitLabel}</Button>
          <Button variant="secondary" type="button" onClick={handleClose}>Cancel</Button>
        </div>
      </Form>
    </Container>
  );
};

export default UserForm;
