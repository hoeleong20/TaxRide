import React, { createContext, useState } from "react";

export const LoginContext = createContext();

export const LoginProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [gDriveConnection, setGDriveConnection] = useState(false);

  return (
    <LoginContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        gDriveConnection,
        setGDriveConnection,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
};

export default LoginProvider;
