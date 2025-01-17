import React, { createContext, useState, useEffect } from "react";
import { BASE_URL } from "@env";

export const FilesContext = createContext();

export const FilesProvider = ({ children }) => {
  const { loggedInEmail } = useContext(LoginContext);

  const [structuredData, setStructuredData] = useState([]);

  const fetchFilesFromGDrive = async () => {
    try {
      const response = await fetch(`${BASE_URL}/files?email=${loggedInEmail}`);
      if (response.ok) {
        const data = await response.json();
        setStructuredData(data);
      } else {
        console.error("Failed to fetch files from Google Drive");
        const errorData = await response.json();
        console.error("Error details:", errorData);
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

  // Log whenever `structuredData` updates
  useEffect(() => {
    console.log("structuredData updated:", structuredData);
  }, [structuredData]);

  return (
    <FilesContext.Provider value={{ structuredData, refreshFiles }}>
      {children}
    </FilesContext.Provider>
  );
};

export default FilesProvider;
