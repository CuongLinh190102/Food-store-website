import { useState, useEffect, createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import * as userService from '../services/userService';
import { toast } from 'react-toastify';

const AuthContext = createContext(null); // Context để xác định người dùng đã đăng nhập hay chưa

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(userService.getUser());
  const navigate = useNavigate(); 

  useEffect(() => {
    if(user?.isBlocked) {
      handleBlockedUser();
    }
  }, [user]);

  const handleBlockedUser = () => {
    userService.logout();
    setUser(null);
    navigate('/login');
    toast.error('Your account has been blocked! Please contact the admin for more information.');
  }

  const login = async (email, password) => {
    try {
      const user = await userService.login(email, password);
      setUser(user);
      console.log('User:', user);
      new Promise(resolve => setTimeout(resolve, 1000)); // Giả lập thời gian chờ 1 giây
      if (user.isBlocked) {
        console.log('User is blocked:', user.isBlocked);
        handleBlockedUser();
        return;
      }
      toast.success('Login Successful');
    } catch (err) {
      toast.error(err.response.data);
    }
  };

  const register = async data => {
    try {
      const user = await userService.register(data);
      setUser(user);
      toast.success('Register Successful');
    } catch (err) {
      toast.error(err.response.data);
    }
  };

  const logout = () => {
    userService.logout();
    setUser(null);
    toast.success('Logout Successful');
  };

  const updateProfile = async user => {
    const updatedUser = await userService.updateProfile(user);
    toast.success('Profile Update Was Successful');
    if (updatedUser) setUser(updatedUser);
  };

  const changePassword = async passwords => {
    await userService.changePassword(passwords);
    logout();
    toast.success('Password Changed Successfully, Please Login Again!');
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, register, updateProfile, changePassword }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
