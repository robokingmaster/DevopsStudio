import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api';

const LoginForm = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();  
  const { login } = useAuth();

  const handleLogin = async (values) => {    
    try {
      const res = await API.post('/auth/login', values);
      const { token, user } = res.data;
      const userdata = { 
        loginid: user.loginid,
        fullname: user.fullname, 
        email: user.email, 
        userrole: user.userrole, 
        profile_image: user.profile_image || 'profile.jpg', 
        token: token
      };
      login(userdata);

      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit(handleLogin)} className="bg-white p-8 rounded shadow-md w-full max-w-sm" name="LoginForm">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Login ID</label>
          <input
            type="text"
            {...register('loginid', { required: 'loginid is required' })}
            className="w-full px-3 py-2 border rounded"
          />
          {errors.loginid && <p className="text-red-500 text-sm">{errors.loginid.message}</p>}
        </div>

        <div className="mb-6">
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            {...register('password', { required: 'Password is required' })}
            className="w-full px-3 py-2 border rounded"
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Sign In
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
