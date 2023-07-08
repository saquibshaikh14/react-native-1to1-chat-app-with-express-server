import React, { createContext, useState, useEffect } from 'react';
import apiCall from '../api/apiAdapter';
import constant from '../utility/constant';

export const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthContextProvider({ children }: { children: React.ReactNode }) {
  // const [isAppReady, setAppReady] = useState<Boolean>(false);
  const [error, setError] = useState<AppError | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const login = async (username: string, password: string): Promise<User> => {
    //handle login
    console.log("==================login called=======", { username, password });

    const response = await apiCall<ApiResponse<User>>('POST', constant.LOGIN_ENDPOINT, { body: { username, password } });

    if (!response.ok) {
      if (user) setUser(null);
      return Promise.reject(response.error);
    }

    console.log("===login response===", response.data!.data)
    const loggedInUser = response.data!.data as User;
    setUser(loggedInUser);
    return Promise.resolve(loggedInUser);
  }
  const logout = () => {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )

}