import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './ProtectedRoute';

import LoginForm from './pages/LoginForm';
import Dashboard from './pages/Dashboard';
import Unauthorized from './pages/Unauthorized';
import ShowUsers from './pages/ShowUsers';
import AddUser from './pages/AddUser';

function App() {
  // const [user, setUser] = useState(null);

  return (
    <AuthProvider>
      <Router>
        <div style={{ padding: '20px' }}>
          <Routes>
            <Route path="/" element={<LoginForm />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/dashboard" element={<ProtectedRoute userrole="admin"><Dashboard /></ProtectedRoute>}/>
            <Route path="/adduser" element={<ProtectedRoute userrole="admin"><AddUser /></ProtectedRoute>} />
            <Route path="/showusers" element={<ProtectedRoute userrole="admin"><ShowUsers /></ProtectedRoute>} />
            
            {/* Protected Route with a parameter */}
            {/* <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} role="admin" user={user} setUser={setUser} />}>
              <Route path="/dashboard" element={<Dashboard user={user} setUser={setUser}></Dashboard>} />
              <Route path="/profile" element={<Profile />} />
            </Route> */}

          {/* <Route path="/add-admin" element={<ProtectedRoute role="admin"><UserForm /></ProtectedRoute>} />  
          <Route path="/editprofile/:id" element={<ProtectedRoute role="admin"><EditProfile /></ProtectedRoute>} />           */}

          {/* <Route path="/dashboard" element={<Dashboard user={user} setUser={setUser} />} /> */}
          </Routes>
        </div>
      </Router>
     </AuthProvider> 
  );
}

export default App;


// const App = () => (
//   <Router>
//     <AuthProvider>
//       <Routes>
//         <Route path="/" element={<Login setUser={setUser} />} />
//         <Route path="/dashboard" element={
//           <ProtectedRoute role="admin"><Dashboard /></ProtectedRoute>
//         } />
//         <Route path="/add-admin" element={
//           <ProtectedRoute role="admin"><AddAdmin /></ProtectedRoute>
//         } />
//         <Route path="/profile" element={
//           <ProtectedRoute><Profile /></ProtectedRoute>
//         } />
//         <Route path="/unauthorized" element={<Unauthorized />} />
//       </Routes>
//     </AuthProvider>
//   </Router>
// );

// export default App;

