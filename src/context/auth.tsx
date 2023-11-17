import { useQuery } from '@apollo/client';
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { GET_ME } from '../utils/graphql';
import { axiosService } from '../axios/axiosService';
import { toast } from 'react-toastify';

export interface AuthContextProps {
  user: any;
  onLogin: (email: string, password: string) => void;
  onLogout: () => void;
  refreshUser: () => void;
}

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  onLogin: () => {},
  onLogout: () => {},
  refreshUser: () => {}
});

export const useAuth = () => {
  const context = useContext(AuthContext);

  return context;
};

export const AuthProvider = (props: {
  children: React.ReactChild[] | React.ReactChild;
}) => {
  const { data: userRes, refetch: refreshUser, error, loading } = useQuery(GET_ME)
  
  const [user, setUser] = useState()
  const onLogin = async (email: string, password: string) => {
    try {
      const res: any = await axiosService.post('/login', {
        email,
        password
      })

      localStorage.setItem('auth_token', res.data)
      refreshUser()
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  const onLogout = () => {
    localStorage.removeItem('auth_token')
    refreshUser()
  }

  useEffect(() => {
    if (error) {
      setUser(undefined)
    } else {
      setUser(userRes?.me)
    }
  }, [userRes, error, loading])

  useEffect(() => {
    if (error?.message?.includes('Access denied!')) {
      localStorage.removeItem('auth_token')
    }
  }, [error])

  return (
    <AuthContext.Provider
      value={{
        user,
        onLogin,
        onLogout,
        refreshUser
      }}>
      {props.children}
    </AuthContext.Provider>
  );
};
