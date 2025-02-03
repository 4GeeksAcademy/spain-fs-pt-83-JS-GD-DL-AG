import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  TextField,
  Paper,
  Card,
  CardContent,
  Snackbar,
  Alert,
  MenuItem,
} from "@mui/material";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../Firebase/Firebase";

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
    <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
      <Paper elevation={4} sx={{ width: "100%", maxWidth: 500, padding: 4, borderRadius: 3 }}>
        <Typography variant="h5" sx={{ textAlign: "center", fontWeight: "bold", mb: 2 }}>
          📁 Subir Documento
        </Typography>
        <Card sx={{ boxShadow: 2, borderRadius: 2 }}>
          <CardContent>
            <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                label="Título"
                name="title"
                value={formData.title}
                onChange={handleChange}
                fullWidth
                required
              />
              <TextField
                label="Descripción"
                name="description"
                value={formData.description}
                onChange={handleChange}
                fullWidth
                multiline
                rows={3}
              />
              <TextField
                select
                label="Tipo"
                name="type"
                value={formData.type}
                onChange={handleChange}
                fullWidth
                required
              >
                <MenuItem value="Document">Documento</MenuItem>
                <MenuItem value="Video">Video</MenuItem>
              </TextField>
              <TextField
                label="Materia"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                fullWidth
                required
              />
              <TextField
                type="file"
                onChange={handleFileChange}
                InputLabelProps={{ shrink: true }}
                fullWidth
                required
              />
              <TextField
                label="URL de Imagen (Opcional)"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                fullWidth
                placeholder="https://mi-imagen.com/imagen.jpg"
              />
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={uploading}
                fullWidth
              >
                {uploading ? <CircularProgress size={24} /> : "Subir Archivo"}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Paper>

      {/* Notificación Snackbar */}
      <Snackbar open={openSnackbar} autoHideDuration={4000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity={message.severity} sx={{ width: "100%" }}>
          {message.text}
        </Alert>
      </Snackbar>
    </Box>
  );
};
