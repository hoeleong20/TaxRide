import React, { createContext, useState, useEffect, useContext } from "react";
import { BASE_URL } from "@env";
import { LoginContext } from "./LoginContext";

export const FilesContext = createContext();

export const FilesProvider = ({ children }) => {
  const { loggedInEmail } = useContext(LoginContext);

  const [structuredData, setStructuredData] = useState([]);

  const fetchFilesFromGDrive = async () => {
    if (!loggedInEmail) {
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/files?email=${loggedInEmail}`);
      if (response.ok) {
        const data = await response.json();
        setStructuredData(data);
      } else {
        const errorData = await response.json();
      }
    } catch (error) {
      console.error("Error fetching files from Google Drive:", error);
    }
  };

  const refreshFiles = async () => {
    await fetchFilesFromGDrive();
  };

  useEffect(() => {
    fetchFilesFromGDrive();
  }, []);


  return (
    <FilesContext.Provider value={{ structuredData, refreshFiles }}>
      {children}
    </FilesContext.Provider>
  );
};

export default FilesProvider;
