import ReactDOM from 'react-dom/client';
import { AuthProvider } from './context/AuthContext';
import App from './app';
import './css-styles/index.css'; 
import 'bootstrap/dist/css/bootstrap.min.css'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthProvider>
    <App />
  </AuthProvider>
);

