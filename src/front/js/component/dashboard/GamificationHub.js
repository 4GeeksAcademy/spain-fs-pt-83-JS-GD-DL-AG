import React, { useState, useEffect } from "react";
import { Box, Typography, LinearProgress, Avatar, Tooltip, Grid, Card, CardContent } from "@mui/material";

export const GamificationHub = () => {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const userId = user ? user.id : null;

  const [userData, setUserData] = useState(null);
  const [badges, setBadges] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    const userId = user ? user.id : null;
  
    if (!userId) {
      console.error("User ID is undefined, cannot fetch data");
      return;
    }
  
    fetch(`https://super-couscous-wr94q9xj47xgcgg9v-3001.app.github.dev/api/user/${userId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then(setUserData)
      .catch((error) => console.error("Error fetching user:", error));
  
    fetch(`https://super-couscous-wr94q9xj47xgcgg9v-3001.app.github.dev/api/badges/${userId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then(setBadges)
      .catch((error) => console.error("Error fetching badges:", error));
  
    fetch(`https://super-couscous-wr94q9xj47xgcgg9v-3001.app.github.dev/api/leaderboard`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then(setLeaderboard)
      .catch((error) => console.error("Error fetching leaderboard:", error));
  }, []);

  if (!userData) return <Typography>Cargando...</Typography>;

  return (
    <Box sx={{ padding: 3, borderRadius: "16px", boxShadow: 3, background: "#fff" }}>
      <Typography variant="h6">Nivel {Math.floor(userData.experience / 1000)}</Typography>
      <LinearProgress value={(userData.experience % 1000) / 1000 * 100} sx={{ height: 10, borderRadius: 5 }} />
      <Typography variant="body2">{userData.experience} XP</Typography>

      <Typography variant="h6" sx={{ marginTop: 3 }}>🎖️ Insignias</Typography>
      <Box sx={{ display: "flex", gap: 2, marginTop: 1 }}>
        {badges.map((badge, index) => (
          <Tooltip key={index} title={badge.name}>
            <Avatar
              src={badge.icon}
              sx={{
                filter: badge.unlocked ? "none" : "grayscale(100%) opacity(0.5)",
                cursor: "pointer"
              }}
            />
          </Tooltip>
        ))}
      </Box>

      <Typography variant="h6" sx={{ marginTop: 3 }}>📊 Ranking</Typography>
      <Grid container spacing={2}>
        {leaderboard.map((user, index) => (
          <Grid item xs={12} key={index}>
            <Card sx={{ display: "flex", justifyContent: "space-between", padding: 1 }}>
              <CardContent>
                <Typography variant="body1">{index + 1}. {user.username}</Typography>
              </CardContent>
              <Typography variant="body2" sx={{ padding: 1 }}>{user.points} XP</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};