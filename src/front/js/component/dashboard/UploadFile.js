import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  TextField,
  Card,
  CardContent,
  Snackbar,
  Alert,
  MenuItem,
} from "@mui/material";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../Firebase/Firebase";
import { TypingEffect } from "../dashboard/TypingEffect";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";

export const UploadFile = ({ handleAction }) => {
  const DEFAULT_IMAGE_URL = "https://e00-elmundo.uecdn.es/assets/multimedia/imagenes/2021/12/22/16401922123443.jpg";
  const user = JSON.parse(localStorage.getItem("user"));
  const uploadedBy = user ? user.name : "Unknown";

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "Document",
    subject: "",
    file: null,
    image_url: "",
  });

  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ text: "", severity: "info" });
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // Manejar cambios en los campos del formulario
  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  // Manejar selección de archivo
  const handleFileChange = (event) => {
    setFormData({ ...formData, file: event.target.files[0] });
  };

  // Manejar la subida del archivo y guardar en la DB
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.file) {
      setMessage({ text: "Por favor selecciona un archivo.", severity: "warning" });
      setOpenSnackbar(true);
      return;
    }

    setUploading(true);
    const storageRef = ref(storage, `uploads/${formData.file.name}`);

    try {
      // Subir archivo a Firebase Storage
      await uploadBytes(storageRef, formData.file);
      const downloadURL = await getDownloadURL(storageRef);

      // Si el usuario no ingresa una imagen, usar la imagen por defecto
      const finalImageUrl = formData.image_url.trim() ? formData.image_url : DEFAULT_IMAGE_URL;
      const user = JSON.parse(localStorage.getItem("user"));
      console.log("User from localStorage:", user); // 🔍 Verifica en consola

      const uploadedBy = user && user.username ? user.username : "Unknown";

      const documentData = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        subject: formData.subject,
        src_url: downloadURL,
        image_url: finalImageUrl,
        uploaded_by: uploadedBy, // ⚡ Ahora se envía correctamente el nombre del usuario
      };

      // 🔍 Verifica en la consola antes de enviar
      console.log("Data sent to backend:", documentData);
      // Enviar datos a la API Flask
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/documents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(documentData),
      });

      if (!response.ok) throw new Error("Error al guardar en la base de datos");

      setMessage({ text: "Documento subido con éxito.", severity: "success" });
      setFormData({ title: "", description: "", type: "Document", subject: "", file: null, image_url: "" });
      if (handleAction) {
        handleAction("upload_file");
      }
    } catch (error) {
      console.error("Error al subir el archivo:", error);
      setMessage({ text: "Error al subir el archivo.", severity: "error" });
    } finally {
      setUploading(false);
      setOpenSnackbar(true);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        padding: 4,
      }}
    >
      <Box
        elevation={6}
        sx={{
          width: "100%",
          maxWidth: 500,
          padding: 4,
          borderRadius: 4,
          backdropFilter: "blur(10px)",
          backgroundColor: "white",
          boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.2)",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "center", mb: "1" }}>
          <TypingEffect text="Upload Resources" speed={80} />
        </Box>
        <Card sx={{ boxShadow: "none", borderRadius: 3, backgroundColor: "transparent" }}>
          <CardContent sx={{ backgroundColor: "transparent", padding: 0 }}>
            <Box
              component="form"
              noValidate
              autoComplete="off"
              onSubmit={handleSubmit}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 3,
              }}
            >
              <TextField
                label="Título"
                name="title"
                value={formData.title}
                onChange={handleChange}
                fullWidth
                required
                sx={{
                  borderRadius: 3,
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  backdropFilter: "blur(8px)",
                  boxShadow: "0px 2px 6px rgba(0,0,0,0.1)",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    "& fieldset": { borderColor: "#ff6a88" },
                    "&:hover fieldset": { borderColor: "#ff99ac" },
                    "&.Mui-focused fieldset": { borderColor: "#ff6a88", boxShadow: "0px 0px 12px rgba(255, 106, 136, 0.5)" },
                  },
                }}
              />
              <TextField
                label="Descripción"
                name="description"
                value={formData.description}
                onChange={handleChange}
                fullWidth
                multiline
                rows={3}
                sx={{
                  borderRadius: 3,
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  backdropFilter: "blur(8px)",
                  boxShadow: "0px 2px 6px rgba(0,0,0,0.1)",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    "& fieldset": { borderColor: "#ff6a88" },
                    "&:hover fieldset": { borderColor: "#ff99ac" },
                    "&.Mui-focused fieldset": { borderColor: "#ff6a88", boxShadow: "0px 0px 12px rgba(255, 106, 136, 0.5)" },
                  },
                }}
              />
              <TextField
                label="Materia"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                fullWidth
                required
                sx={{
                  borderRadius: 3,
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  backdropFilter: "blur(8px)",
                  boxShadow: "0px 2px 6px rgba(0,0,0,0.1)",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    "& fieldset": { borderColor: "#ff6a88" },
                    "&:hover fieldset": { borderColor: "#ff99ac" },
                    "&.Mui-focused fieldset": { borderColor: "#ff6a88", boxShadow: "0px 0px 12px rgba(255, 106, 136, 0.5)" },
                  },
                }}
              />
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <input
                  accept="image/*, .pdf, .doc, .docx"
                  style={{ display: "none" }}
                  id="file-upload"
                  type="file"
                  onChange={handleFileChange}
                />
                <label htmlFor="file-upload">
                  <Button
                    component="span"
                    fullWidth
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 1,
                      background: "linear-gradient(45deg, #ff6a88, #ff99ac)",
                      color: "white",
                      fontWeight: "bold",
                      padding: "10px 20px",
                      borderRadius: 3,
                      textTransform: "none",
                      boxShadow: "0px 4px 10px rgba(255, 106, 136, 0.3)",
                      transition: "all 200ms ease-in-out",
                      "&:hover": {
                        filter: "brightness(1.1)",
                        transform: "translateY(-2px)",
                        boxShadow: "0px 6px 14px rgba(255, 106, 136, 0.4)",
                      },
                    }}
                  >
                    <CloudUploadOutlinedIcon sx={{ fontSize: 24 }} />
                    Seleccionar Archivo
                  </Button>
                </label>
                {formData.file && (
                  <Typography
                    variant="body2"
                    sx={{
                      textAlign: "center",
                      color: "#ff6a88",
                      fontWeight: "bold",
                      mt: -1,
                    }}
                  >
                    {formData.file.name}
                  </Typography>
                )}
              </Box>
              <TextField
                label="URL de Imagen (Opcional)"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                fullWidth
                placeholder="https://mi-imagen.com/imagen.jpg"
                sx={{
                  borderRadius: 3,
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  backdropFilter: "blur(8px)",
                  boxShadow: "0px 2px 6px rgba(0,0,0,0.1)",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    "& fieldset": { borderColor: "#ff6a88" },
                    "&:hover fieldset": { borderColor: "#ff99ac" },
                    "&.Mui-focused fieldset": { borderColor: "#ff6a88", boxShadow: "0px 0px 12px rgba(255, 106, 136, 0.5)" },
                  },
                }}
              />
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={uploading}
                fullWidth
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                  background: "linear-gradient(45deg, #ff6a88, #ff99ac)",
                  color: "white",
                  fontWeight: "bold",
                  padding: "10px 20px",
                  borderRadius: 3,
                  textTransform: "none",
                  boxShadow: "0px 4px 10px rgba(255, 106, 136, 0.3)",
                  transition: "all 200ms ease-in-out",
                  "&:hover": {
                    filter: "brightness(1.1)",
                    transform: "translateY(-2px)",
                    boxShadow: "0px 6px 14px rgba(255, 106, 136, 0.4)",
                  },
                }}
                
              >
                {uploading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Upload Document"}
              </Button>
            </Box>
          </CardContent>

        </Card>
      </Box>

      <Snackbar open={openSnackbar} autoHideDuration={4000} onClose={() => setOpenSnackbar(false)}>
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={message.severity}
          sx={{
            width: "100%",
            borderRadius: 3,
            boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
          }}
        >
          {message.text}
        </Alert>
      </Snackbar>
    </Box>
  );
};
