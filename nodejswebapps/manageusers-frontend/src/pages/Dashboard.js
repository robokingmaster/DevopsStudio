import { Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/" />;
  }

  return (
    <div>
      <Navbar/>
      <div style={{ padding: '20px' }}>
        <h2>Welcome, {user.name}!</h2>
        <h2>Your Login As, {user.role}!</h2>
        <p>This is your dashboard.</p>
      </div>
    </div>
  );
}

export default Dashboard;
