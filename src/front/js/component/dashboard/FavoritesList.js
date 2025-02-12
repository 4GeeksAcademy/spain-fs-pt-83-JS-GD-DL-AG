"use client"

import React, { useEffect, useState, useCallback } from "react"
import {
  Box,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  CircularProgress,
  Alert,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
  Tooltip,
} from "@mui/material"
import { ArrowForwardIos, OpenInNew, Delete } from "@mui/icons-material"
import { styled } from "@mui/material/styles"
import { useNavigate } from "react-router-dom"
import { TypingEffect } from "../dashboard/TypingEffect"

const StyledCard = styled(Card)(({ theme }) => ({
  width: "100%",
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius * 2,
  marginTop: theme.spacing(2),
  background: "transparent",
  boxShadow: "none",
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-5px)",
  },
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(1),
  },
}))

const StyledListItem = styled(ListItem)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 1.5,
  marginBottom: theme.spacing(1),
  padding: theme.spacing(1.5),
  boxShadow: theme.shadows[2],
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
    transform: "scale(1.02)",
  },
  transition: "all 0.3s ease-in-out",
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    alignItems: "flex-start",
    padding: theme.spacing(1),
  },
}))

const StyledListItemText = styled(ListItemText)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}))

const ActionButtons = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  [theme.breakpoints.down("sm")]: {
    width: "100%",
    justifyContent: "space-between",
    marginTop: theme.spacing(1),
  },
}))

export const FavoritesList = () => {
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchFavorites = useCallback(async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("No hay token en localStorage.")
      const response = await fetch(`${process.env.BACKEND_URL}/api/favorites`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      })
      if (!response.ok) throw new Error(`Error en la API: ${response.status} ${response.statusText}`)
      const data = await response.json()
      setFavorites(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchFavorites()
  }, [fetchFavorites])

  const handleDeleteFavorite = async (favoriteId) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${process.env.BACKEND_URL}/api/favorites/${favoriteId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!response.ok) throw new Error("Error eliminando favorito")
      setFavorites((prevFavorites) => prevFavorites.filter((fav) => fav.id !== favoriteId))
    } catch (error) {
      console.error("Error eliminando favorito:", error)
      setError("Error al eliminar el favorito. Por favor, inténtalo de nuevo.")
    }
  }

  const handleOpenDocument = (url) => {
    if (!url) return
    const newTab = window.open(url, "_blank")
    if (!newTab) {
      alert("Pop-up blocked! Please allow pop-ups for this site.")
    }
  }

  useEffect(() => {
    console.log("Favorites:", favorites)
  }, [favorites])

  return (
    <Box sx={{ position: "relative", width: "100%" }}>
      <StyledCard>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <TypingEffect text="My Favourite Resources" speed={80} />
        </Box>
        <CardContent
          sx={{
            mb: 0,
            pb: 0,
            height: { xs: 300, sm: 310 },
            overflowY: "auto",
            "&::-webkit-scrollbar": {
              width: "8px",
              backgroundColor: "transparent",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: theme.palette.primary.light,
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              backgroundColor: theme.palette.primary.main,
            },
            maskImage: "linear-gradient(to bottom, black 85%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, black 85%, transparent 100%)",
          }}
        >
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 200 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : favorites.length === 0 ? (
            <Alert severity="info">You don't have any favorites yet.</Alert>
          ) : (
            <List sx={{ width: "100%", bgcolor: "background.paper", borderRadius: theme.shape.borderRadius }}>
              {favorites.map((fav, index) => (
                <React.Fragment key={fav.id}>
                  <StyledListItem>
                    <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
                      <ListItemAvatar>
                        <Avatar
                          src={
                            fav.image_url ||
                            "https://e00-elmundo.uecdn.es/assets/multimedia/imagenes/2021/12/22/16401922123443.jpg"
                          }
                          sx={{
                            width: { xs: 40, sm: 48 },
                            height: { xs: 40, sm: 48 },
                            borderRadius: theme.shape.borderRadius,
                          }}
                          variant="rounded"
                        />
                      </ListItemAvatar>
                      <StyledListItemText
                        primary={
                          <Typography
                            variant="subtitle1"
                            fontWeight="bold"
                            sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
                          >
                            {fav.document_title}
                          </Typography>
                        }
                        secondary={
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
                          >
                            {fav.document_type}
                          </Typography>
                        }
                      />
                    </Box>
                    <ActionButtons>
                      <Tooltip title={fav.src_url ? "Open document" : "URL not available"}>
                        <span>
                          <IconButton
                            edge="end"
                            onClick={() => {
                              console.log("Opening URL:", fav.src_url)
                              handleOpenDocument(fav.src_url)
                            }}
                            disabled={!fav.src_url}
                            sx={{ mr: 1 }}
                          >
                            <OpenInNew />
                          </IconButton>
                        </span>
                      </Tooltip>
                      <IconButton edge="end" onClick={() => handleDeleteFavorite(fav.id)} sx={{ mr: 1 }}>
                        <Delete />
                      </IconButton>
                      <IconButton edge="end" onClick={() => navigate(`/dashboard/favorites/`)}>
                        <ArrowForwardIos />
                      </IconButton>
                    </ActionButtons>
                  </StyledListItem>
                  {index < favorites.length - 1 && <Divider sx={{ my: 1 }} />}
                </React.Fragment>
              ))}
            </List>
          )}
        </CardContent>
      </StyledCard>
    </Box>
  )
}

