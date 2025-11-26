import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppRoutes } from "./routes/AppRoutes"
import { auth } from './utils/api';
import { loginSuccess, logout } from './store/authSlice';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await auth.getMe();
          if (response.success && response.data) {
            dispatch(loginSuccess({ user: response.data, token }));
          } else {
            dispatch(logout());
          }
        } catch (error) {
          console.error('Auth initialization failed:', error);
          dispatch(logout());
        }
      }
    };

    initAuth();
  }, [dispatch]);

  return (
    <AppRoutes />
  )
}

export default App
