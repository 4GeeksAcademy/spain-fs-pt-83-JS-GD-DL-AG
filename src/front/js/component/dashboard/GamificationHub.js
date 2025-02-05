import React, { useState, useEffect } from "react"
import { Box, Typography, LinearProgress, Avatar, Tooltip, Card } from "@mui/material"
import { useMediaQuery, useTheme } from "@mui/material"
import { styled } from "@mui/material/styles"
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents"
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import StarsIcon from "@mui/icons-material/Stars"

const StyledLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  backgroundColor: theme.palette.grey[200],
  "& .MuiLinearProgress-bar": {
    borderRadius: 5,
    background: "linear-gradient(90deg, #00C9FF 0%, #92FE9D 100%)",
  },
}))

const BadgeAvatar = styled(Avatar, {
  shouldForwardProp: (prop) => prop !== "unlocked",
})(({ unlocked }) => ({
  width: 50,
  height: 50,
  transition: "all 0.3s ease",
  filter: unlocked ? "none" : "grayscale(100%) opacity(0.5)",
  "&:hover": {
    transform: "scale(1.1)",
  },
}))

const LeaderboardCard = styled(Card)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: theme.spacing(2),
  boxShadow: "none",
  background: "transparent",
  borderBottom: `1px solid ${theme.palette.divider}`,
  "&:last-child": {
    borderBottom: "none",
  },
}))

export const GamificationHub = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery("(max-width: 1200px)");
  const storedUser = localStorage.getItem("user")
  const user = storedUser ? JSON.parse(storedUser) : null
  const userId = user ? user.id : null

  const [userData, setUserData] = useState(null);
  const [badges, setBadges] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);

  const BACKEND_URL = process.env.BACKEND_URL; // 🔥 Obtiene el BACKEND_URL desde .env
  const token = localStorage.getItem("token"); // 🔥 Obtiene el token de autenticación

  useEffect(() => {
    if (!userId) {
      console.error("User ID is undefined, cannot fetch data");
      return;
    }

    const fetchUserData = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}`},
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
    <Box sx={{ padding: 3,}}>
      <Box sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}>
        <Box sx={{ position: "relative" }}>
          {!isMobile && (
            <StarsIcon
              sx={{
                position: "absolute",
                top: -75,
                left: -30,
                fontSize: 100,
                color: "#FF6A88",
                transform: "rotate(-20deg)",
                zIndex: 1000,
                transition: "all 0.3s ease-in-out",
                pointerEvents: "auto",
                "&:hover": {
                  transform: "rotate(0deg) scale(1.1)",
                  color: "#FF99AC",
                },
              }}
            />
          )}
        </Box>
        <Box sx={{ flex: 1, textAlign: "center", paddingTop: "50px" }}>
          <Typography variant="h4" fontWeight="bold" sx={{ color: "#FF6A88" }}>
            Level {isNaN(level) ? "0" : level}
          </Typography>
        </Box>
      </Box>
      <StyledLinearProgress variant="determinate" value={isNaN(progress) ? 0 : progress} />
      <Typography variant="body1" sx={{ marginTop: 1, fontWeight: "bold", color: "#FF6A88 !important" }}>
        {experience} XP
      </Typography>
      <Box sx={{ marginTop: 4 }}>
        <Typography variant="h5" fontWeight="bold" sx={{ display: "flex", alignItems: "center", marginBottom: 2, color: "#FF6A88" }}>
          <EmojiEventsIcon sx={{ marginRight: 1, color: "#FF6A88" }} />
          Badges
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          {badges.length > 0 ? (
            badges.map((badge, index) => (
              <Tooltip key={index} title={badge.name}>
                <BadgeAvatar src={badge.icon} unlocked={badge.unlocked} />
              </Tooltip>
            ))
          ) : (
            <Typography variant="body2" sx={{ color: "gray" }}>
              No badges yet
            </Typography>
          )}
        </Box>
      </Box>
      <Box sx={{ marginTop: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", marginBottom: 2, color: "#FF6A88" }}>
          <LeaderboardIcon sx={{ marginRight: 1, color: "#FF6A88" }} />
          <Typography variant="h5" fontWeight="bold">
            LeaderBoard
          </Typography>
        </Box>
        <Box sx={{ maxHeight: 300, overflow: "auto" }}>
          {leaderboard.length > 0 ? (
            leaderboard.map((user, index) => (
              <LeaderboardCard key={index}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography variant="h6" sx={{ marginRight: 2, color: index < 3 ? "#FF6A88" : "inherit" }}>
                    {index + 1}.
                  </Typography>
                  <Typography variant="body1" sx={{ color: "#FF6A88" }}>{user.username}</Typography>
                </Box>
                <Typography variant="body2" fontWeight="bold" sx={{ color: "#FF6A88" }}>
                  {user.points} XP
                </Typography>
              </LeaderboardCard>
            ))
          ) : (
            <Typography variant="body2" sx={{ color: "#FF6A88", textAlign: "center" }}>
              No leaderboard data
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  )
}