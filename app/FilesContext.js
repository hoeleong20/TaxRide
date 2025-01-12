import React, { createContext, useState, useEffect } from "react";
import { BASE_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const FilesContext = createContext();

export const FilesProvider = ({ children }) => {
  const [structuredData, setStructuredData] = useState({
    years: {}, // Object to store year-based data
  });

  // Fetch files from Google Drive and local storage
  const fetchFiles = async () => {
    try {
      // Fetch files from Google Drive
      const response = await fetch(`${BASE_URL}/files`);
      const driveFiles = await response.json();

      // Fetch files from local storage
      const localFiles =
        JSON.parse(await AsyncStorage.getItem("localFiles")) || [];

      // Combine Google Drive files and local files
      const allFiles = [
        ...driveFiles,
        ...localFiles.map((file) => ({
          ...file,
          id: `local-${file.name}`, // Add unique ID for local files
          size: 0, // Set size to 0 for local files
          modifiedTime: new Date().toISOString(), // Use current date for local files
          directLink: null, // No direct link for local files
        })),
      ];

      // Process combined files
      const organizedData = allFiles.reduce((acc, file) => {
        const [year, category, fileNameWithExtension] = file.name.split("-");
        const fileName = fileNameWithExtension.split(".")[0]; // Remove extension

        // Ensure year exists in structure
        if (!acc[year]) acc[year] = {};

        // Ensure category exists under year
        if (!acc[year][category]) acc[year][category] = [];

        // Add file data
        acc[year][category].push({
          id: file.id,
          fileName,
          size: file.size,
          modifiedTime: file.modifiedTime,
          directLink: file.directLink,
        });

        return acc;
      }, {});

      setStructuredData({ years: organizedData });
    } catch (error) {
      console.error("Error fetching or processing files:", error);
    }
  };

  const refreshFiles = async () => {
    await fetchFiles();
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <FilesContext.Provider value={{ structuredData, refreshFiles }}>
      {children}
    </FilesContext.Provider>
  );
};

export default FilesProvider;
