import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import API from '../api';
import Navbar from '../components/Navbar';
import UpdateUser from './UpdateUser';

function UserTable() {
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null); 
  const [deleteUser, setDeleteUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);  
  const [searchTerm, setSearchTerm] = useState('');  

  const navigate = useNavigate();

  const fetchUsers = async () => {
    const res = await API.get('/api/users');
    setUsers(res.data); 
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const confirmDelete = (user) => {
    setDeleteUser(user);
    setShowDeleteModal(true);
  };

  const handleDelete = () => {    
    try {
      API.delete(`/api/users/${deleteUser.loginid}`);
      setUsers(users.filter(user => user.loginid !== deleteUser.loginid));
      setShowDeleteModal(false);
      setDeleteUser(null);
    } catch (err) {
      console.error(err)
    }    
  };

  const handleClose = () => {
    setEditUser(null);
    setShowDeleteModal(false);
    setDeleteUser(null)
    // Clean up Bootstrap modal artifacts
    document.body.classList.remove('modal-open');
    const backdrops = document.querySelectorAll('.modal-backdrop');
    backdrops.forEach((backdrop) => backdrop.remove());
  };

  const handleUpdateSuccess = () => {
    fetchUsers(); // Refresh user list
    handleClose(); // Close modal
  };

  const filteredUsers = users.filter(user =>
    user.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <Navbar/>
      <br></br>
      <div className="d-flex justify-content-center">
        <button className="btn btn-success mb-3" onClick={() => navigate('/adduser')}>Add New User</button>
      </div>
      <h2>Search Account</h2>

      {/* Search Box */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {/* User Table */}
      <table className="table table-bordered table-hover align-middle">
        <thead className="table-light">
          <tr>
            <th scope="col">Image</th>            
            <th scope="col">Full Name</th>   
            <th scope="col">Email</th>   
            <th scope="col">Email Verified?</th>         
            <th scope="col">Phone</th>            
            <th scope="col">Phone Verified?</th>            
            <th scope="col">Date Of Birth</th>            
            <th scope="col">Is Active?</th>
            <th scope="col">Role</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(user => (
            <tr key={user.id}>
              <td>
                <img src={(user.profile_image || user.profile_image == 'None') ? `http://localhost:5000/uploads/${user.profile_image}` : 'http://localhost:5000/uploads/default.jpeg'}
                  alt={user.fullname}
                  style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                  className="img-thumbnail"
                  loading="lazy"
                  decoding="async"
                />
              </td>              
              <td>{user.fullname}</td>              
              <td>{user.email}</td>
              <td>{user.email_verified}</td>
              <td>{user.phone_number}</td>
              <td>{user.phone_verified}</td>              
              <td>{user.date_of_birth}</td>              
              <td>{user.is_active}</td>
              <td>{user.userrole}</td>
              <td>
                <button className="btn btn-primary me-2" onClick={() => setEditUser(user)}>Edit</button>                
                <button className="btn btn-danger" onClick={() => confirmDelete(user)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Profile Modal */}
      {editUser && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Update Profile For User: {editUser.fullname}</h5>                
              </div>
              <div className="modal-body">
                <UpdateUser loginid={editUser.loginid} onClose={handleClose} onUpdateSuccess={handleUpdateSuccess}/>                
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showDeleteModal && deleteUser && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Deletion</h5>
                <button type="button" className="btn-close" onClick={handleClose}></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete <strong>{deleteUser.loginid}</strong>?</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleClose}>Cancel</button>
                <button type="button" className="btn btn-danger" onClick={handleDelete}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserTable;
