import React, { createContext, useState, useEffect } from "react";
import axios from "axios"; // Ensure Axios is installed in your project
import { BASE_URL } from "@env"; // Replace with your environment variable for API base URL

export const LoginContext = createContext();

export const LoginProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [gDriveConnection, setGDriveConnection] = useState(false);
  const [loggedInEmail, setLoggedInEmail] = useState("");
  const [loggedInName, setLoggedInName] = useState(""); // New state for the user's name

  // Fetch user name from the API whenever `loggedInEmail` changes
  useEffect(() => {
    const fetchUserName = async () => {
      if (loggedInEmail) {
        try {
          const response = await axios.get(`${BASE_URL}/get-user-name`, {
            params: { email: loggedInEmail }, // Pass the email as a query parameter
          });
          if (response.data && response.data.name) {
            setLoggedInName(response.data.name); // Assign the name to the state
          } 
        } catch (error) {
          console.error("Failed to fetch user name:", error.message || error);
        }
      }
    };

    fetchUserName();
  }, [loggedInEmail]);

  return (
    <LoginContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        gDriveConnection,
        setGDriveConnection,
        loggedInEmail,
        setLoggedInEmail,
        loggedInName, // Provide the logged-in name to the context
      }}
    >
      {children}
    </LoginContext.Provider>
  );
};

export default LoginProvider;
