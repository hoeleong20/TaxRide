import React, { createContext, useState, useEffect } from "react";
import { BASE_URL } from "@env";

export const FilesContext = createContext();

export const FilesProvider = ({ children }) => {
  const [structuredData, setStructuredData] = useState({
    years: {}, // Object to store year-based data
  });

  const fetchFiles = async () => {
    try {
      const response = await fetch(`${BASE_URL}/files`);
      const data = await response.json();

      // Process files
      const organizedData = data.reduce((acc, file) => {
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
