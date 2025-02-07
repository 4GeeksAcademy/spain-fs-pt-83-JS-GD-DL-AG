import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CircularProgress, Alert } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { CheckCircle, Lock } from "@mui/icons-material";

const achievementsList = [
  { days: 3, badge: "Bronze", icon: "🥉" },
  { days: 5, badge: "Silver", icon: "🥈" },
  { days: 10, badge: "Gold", icon: "🥇" },
  { days: 15, badge: "Platinum", icon: "💎" },
  { days: 30, badge: "Legend", icon: "🏆" }
];

export const AchievementsSlider = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const response = await fetch(`${process.env.BACKEND_URL}/api/achievements`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) {
          throw new Error("Error al obtener logros");
        }

        const data = await response.json();
        setAchievements(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  return (
    <Card sx={{ width: "100%", p: 2, boxShadow: 3 }}>
      <CardHeader title="🎖️ Archivements unlocked" sx={{ textAlign: "center", fontWeight: "bold" }} />
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center py-4">
            <CircularProgress />
          </div>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <Swiper spaceBetween={10} slidesPerView={3} grabCursor>
            {achievementsList.map((ach) => {
              const isUnlocked = achievements.includes(ach.days);
              return (
                <SwiperSlide key={ach.days}>
                  <div
                    className={`flex flex-col items-center justify-center p-4 rounded-lg ${
                      isUnlocked ? "bg-green-100" : "bg-gray-200"
                    } shadow-md`}
                  >
                    <div className="text-4xl">{ach.icon}</div>
                    <h3 className="text-lg font-semibold mt-2">{ach.badge}</h3>
                    <p className="text-sm text-gray-600">Connect {ach.days} días</p>
                    {isUnlocked ? (
                      <CheckCircle className="text-green-500 mt-2" fontSize="large" />
                    ) : (
                      <Lock className="text-gray-400 mt-2" fontSize="large" />
                    )}
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        )}
      </CardContent>
    </Card>
  );
};