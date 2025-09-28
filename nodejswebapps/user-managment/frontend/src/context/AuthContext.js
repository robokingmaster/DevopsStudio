import { createContext, useContext, useState, useEffect, ReactNode  } from 'react';
import Cookies from 'js-cookie';

const AuthContext = createContext({
  user: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const cookieUser = Cookies.get('user');
      if (cookieUser) {
        const parsedUser = JSON.parse(cookieUser);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error('Error parsing user cookie:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (userData) => {
    console.log('Setting Cookies After Sucessful Login');
    setUser(userData);
    Cookies.set('user', JSON.stringify(userData), { expires: 1 }); // expires in 7 days
  };

  const logout = () => {
    console.log('Removing Cookies After Sucessful Logout');
    setUser(null);
    Cookies.remove('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

