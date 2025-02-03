import React, { useState, useEffect } from "react";
import { Box, Typography, LinearProgress, Avatar, Tooltip, Grid, Card, CardContent } from "@mui/material";

export const GamificationHub = ({ userExperience }) => {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const userId = user ? user.id : null;

  const [userData, setUserData] = useState(null);
  const [badges, setBadges] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL; // 🔥 Obtiene el BACKEND_URL desde .env
  const token = localStorage.getItem("token"); // 🔥 Obtiene el token de autenticación

  useEffect(() => {
    if (!userId) {
      console.error("User ID is undefined, cannot fetch data");
      return;
    }

    const fetchUserData = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`Error ${res.status}`);
        setUserData(await res.json());
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    const fetchBadges = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/badges/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`Error ${res.status}`);
        setBadges(await res.json());
      } catch (error) {
        console.error("Error fetching badges:", error);
      }
    };

    const fetchLeaderboard = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/leaderboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`Error ${res.status}`);
        setLeaderboard(await res.json());
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      }
    };

    fetchUserData();
    fetchBadges();
    fetchLeaderboard();
  }, [BACKEND_URL, userId, token]); // 🔹 Ahora depende de BACKEND_URL y el token

  if (!userData) return <Typography>Loading...</Typography>;

  // 🔥 Aseguramos que experience nunca sea null o undefined
  const experience = userData?.experience ?? 0;
  const level = Math.floor(experience / 1000);
  const progress = ((experience % 1000) / 1000) * 100;

  // ✅ Función para registrar acciones del usuario (subida de archivo, comentarios, etc.)
  const handleAction = async (action) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/user/${userId}/complete_action`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ action })
      });

      const data = await response.json();
      console.log("XP Gained:", data.xp_gained);
      if (data.badge_unlocked) {
        console.log("New Badge:", data.badge_unlocked);
      }

      // 🔥 Actualiza el estado con la nueva experiencia del usuario
      setUserData(prevData => ({
        ...prevData,
        experience: data.new_experience
      }));

      // 🔥 Verifica si se ha desbloqueado una nueva insginia y las actualiza
      if (data.badge_unlocked) {
        console.log("New Badge:", data.badge_unlocked);
        setBadges(prevBadges => [...prevBadges, data.badge_unlocked]);
      }

      // 🔥 Refrescar las insignias si se ha desbloqueado una nueva
      fetch(`${BACKEND_URL}/api/badges/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.ok ? res.json() : Promise.reject(`Error ${res.status}`))
        .then(setBadges)
        .catch((error) => console.error("Error fetching updated badges:", error));

    } catch (error) {
      console.error("Error completing action:", error);
    }
  };

  return (
    <Box sx={{ padding: 3, borderRadius: "16px",}}>
      <Typography variant="h6">Level {isNaN(level) ? "0" : level}</Typography>
      <LinearProgress
        variant="determinate"
        value={isNaN(progress) ? 0 : progress}
        sx={{ height: 10, borderRadius: 5 }}
      />
      <Typography variant="body2">{experience} XP</Typography>

      <Typography variant="h6" sx={{ marginTop: 3 }}>🎖️ Badges ({badges.length})</Typography>
      <Box sx={{ display: "flex", gap: 2, marginTop: 1 }}>
        {badges.length > 0 ? (
          badges.map((badge, index) => (
            <Tooltip key={index} title={badge.name}>
              <Avatar
                src={badge.icon}
                sx={{
                  filter: badge.unlocked ? "none" : "grayscale(100%) opacity(0.5)",
                  cursor: "pointer"
                }}
              />
            </Tooltip>
          ))
        ) : (
          <Typography variant="body2" sx={{ color: "gray" }}>No badges yet</Typography>
        )}
      </Box>

      <Typography variant="h6" sx={{ marginTop: 3 }}>📊 Leaderboard</Typography>
      <Grid container spacing={2}>
        {leaderboard.length > 0 ? (
          leaderboard.map((user, index) => (
            <Grid item xs={12} key={index}>
              <Card sx={{ display: "flex", justifyContent: "space-between", padding: 1, boxShadow: "none", background: "transparent" }}>
                <CardContent>
                  <Typography variant="body1">{index + 1}. {user.username}</Typography>
                </CardContent>
                <Typography variant="body2" sx={{ padding: 1 }}>{user.points} XP</Typography>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="body2" sx={{ color: "gray", textAlign: "center" }}>No leaderboard data</Typography>
        )}
      </Grid>
    </Box>
  );
};
