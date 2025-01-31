import React, { useState, useEffect, useContext } from "react";
import { Box, Button, Modal, Typography, Input } from "@mui/material";
import { getStorage, ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
export const UploadFile = () => {
  const [file, setFile] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  useEffect(() => {
    fetchUploadedFiles();
  }, []);
  const storage = getStorage();
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };
  const handleUpload = async () => {
    if (!file) return;
    const storageRef = ref(storage, `uploads/${file.name}`);
    try {
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      setUploadedFiles([...uploadedFiles, { name: file.name, url: downloadURL }]);
      setFile(null);
    } catch (error) {
      console.error("Error al subir el archivo:", error);
    }
  };
   const fetchUploadedFiles = async () => {
     const storageRef = ref(storage, "uploads/");
     try {
       const result = await listAll(storageRef);
       const files = await Promise.all(
         result.items.map(async (fileRef) => {
           const url = await getDownloadURL(fileRef);
           return { name: fileRef.name, url };
         })
       );
       setUploadedFiles(files);
     } catch (error) {
       console.error("Error al obtener archivos:", error);
     }
   };
  return (
    <Box className="container">
        <section className="dashboard-section">
          <h2>Subir Documentos</h2>
          <Input type="file" onChange={handleFileChange} />
          <Button variant="contained" onClick={handleUpload} disabled={!file}>
            Subir Archivo
          </Button>
          <div className="uploaded-files">
            <h3>Archivos Subidos</h3>
            <ul>
              {uploadedFiles.map((file, index) => (
                <li key={index}>
                  <a href={file.url} target="_blank" rel="noopener noreferrer">
                    {file.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
    </Box>
  );
};






