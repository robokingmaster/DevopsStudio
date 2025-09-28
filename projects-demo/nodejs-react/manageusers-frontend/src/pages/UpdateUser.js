import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../api';
import Navbar from '../components/Navbar';
import UserForm from '../components/UserForm';
import 'bootstrap/dist/css/bootstrap.min.css';

const UpdateUser = ({ loginid, onClose, onUpdateSuccess }) => {  
  const [formData, setFormData] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get(`/api/users/${loginid}`);
        setFormData(res.data);
      } catch (err) {
        console.error('Error fetching user:', err);
      }
    };
    fetchUser();
  }, [loginid]);

  const handleClose = () => {
    if (onClose){
      setTimeout(() => onClose(), 0);
    }
  }

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'profile_image' && value instanceof File) {
        data.append(key, value);
      } else {
        data.append(key, value);
      }
    });

    try {
      await API.put(`/api/users/${loginid}`, data);      
      // window.requestAnimationFrame(() => handleClose());
      if (onUpdateSuccess) {
        onUpdateSuccess(); // Refresh user list and close modal
      } else {
        window.requestAnimationFrame(() => onClose()); // Fallback
      }
    } catch (err) {
      console.error('Update failed:', err);
      setError('Failed to update user information.');
    }
  };

  if (!formData) return <div>Loading...</div>;

  return (
    <>
      <UserForm
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}        
        handleClose={handleClose}
        error={error}
        submitted={submitted}
        title="Edit User"
        submitLabel="Update User"
      />
    </>
  );
};

export default UpdateUser;
