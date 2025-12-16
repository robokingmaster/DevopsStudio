import React, { useState } from 'react';
import { Div, Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import Navbar from '../components/Navbar';
import UserForm from '../components/UserForm'
import 'bootstrap/dist/css/bootstrap.min.css'

const AddUser = () => {
    const [formData, setFormData] = useState({
        loginid: '',
        pwdhash: '',
        fullname: '',
        email: '',
        email_verified: 'false',
        is_active: 'false',
        phone_number: '',
        phone_verified: 'false',
        date_of_birth: '',
        userrole: 'user',
        profile_image: null,
    });

    const [submitted, setSubmitted] = useState(false);    
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(true);
    const navigate = useNavigate();

    const handleClose = (e) => {
        setShowForm(false);
        navigate('/showusers');
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');        
        const data = new FormData();

        Object.entries(formData).forEach(([key, value]) => {
            if (key === 'profilepic' && value) {
                data.append(key, value);
            } else {
                data.append(key, value);
            }
        });

        // Setting Default Values
        data.email_verified =  formData.email_verified || 'false'
        data.phone_verified =  formData.phone_verified || 'false'

        try {
            const response = await API.post('/auth/register', data);
            // console.log('Response:', response.data);
            setSubmitted(true);
            // Use requestAnimationFrame to avoid ResizeObserver warning
            window.requestAnimationFrame(() => handleClose());            
        } catch (err) {
            console.error(err);
            setError('Failed to submit user information.');
        }
    };

    return (
        <>
        <Navbar />
        <UserForm
            formData={formData}
            setFormData={setFormData}
            handleSubmit={handleSubmit}
            handleClose={handleClose}
            error={error}
            submitted={submitted}
            title="Add New User"
            submitLabel="Add User"
        />
        </>
    );
};

export default AddUser;
