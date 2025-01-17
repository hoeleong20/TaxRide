import React, { createContext, useState } from "react";

export const LoginContext = createContext();

export const LoginProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [gDriveConnection, setGDriveConnection] = useState(false);
  const [loggedInEmail, setLoggedInEmail] = useState("");

  return (
    <LoginContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        gDriveConnection,
        setGDriveConnection,
        loggedInEmail,
        setLoggedInEmail,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
};

export default LoginProvider;
