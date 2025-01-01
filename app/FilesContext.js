import React, { createContext, useState, useEffect } from "react";
import { BASE_URL } from "@env";

export const FilesContext = createContext();

export const FilesProvider = ({ children }) => {
  const [structuredData, setStructuredData] = useState({
    years: {}, // Object to store year-based data
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/files`);
        const data = await response.json();

        // Process files
        const organizedData = data.reduce((acc, file) => {
          // Extract year, category, and fileName
          const [year, category, fileNameWithExtension] = file.name.split("-");
          const fileName = fileNameWithExtension.split(".")[0]; // Remove extension
          const { id, directLink } = file; // Assume API returns id and directLink

          // Ensure year exists in structure
          if (!acc[year]) acc[year] = {};

          // Ensure category exists under year
          if (!acc[year][category]) acc[year][category] = [];

          // Add file data
          acc[year][category].push({
            id,
            fileName,
            directLink,
          });

          return acc;
        }, {});

        setStructuredData({ years: organizedData });
        console.log(organizedData);
      } catch (error) {
        console.error("Error fetching or processing files:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <FilesContext.Provider value={{ structuredData }}>
      {children}
    </FilesContext.Provider>
  );
};

export default FilesProvider;
