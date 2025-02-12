import React, { useState, useEffect, useMemo } from "react";
import {
    Button, Typography, Box, Dialog, DialogTitle, DialogContent,
    DialogActions, TextField, IconButton, Divider, Switch,
    FormControlLabel
} from "@mui/material";
import { Timer, Pause, Settings, Close, Coffee, Bedtime, PlayArrow } from "@mui/icons-material";
import { usePomodoro } from "./PomodoroContext";
import { PomodoroStepper } from "./PomodoroSteeper";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PomoAlert from "../../../files/PomoAlert.mp3"

export const PomodoroTimer = React.memo(() => {
    const {
        focusTime, setFocusTime,
        shortBreakTime, setShortBreakTime,
        longBreakTime, setLongBreakTime,
        timeLeft, setTimeLeft,
        isRunning, setIsRunning,
        mode, setMode,
        sessionCount, setSessionCount,
        soundEnabled, setSoundEnabled,
        notificationsEnabled, setNotificationsEnabled
    } = usePomodoro();

    const [openSettings, setOpenSettings] = useState(false);

    useEffect(() => {
        if (timeLeft <= 0 && isRunning) {
            setIsRunning(false);

            if (notificationsEnabled) {
                toast.info("Time's up!");
            }
            if (soundEnabled) {
                const audio = new Audio(PomoAlert);
                audio.play();
            }

            setTimeout(() => {
                changeMode();
                setIsRunning(true);
            }, 1000);
        }
    }, [timeLeft, notificationsEnabled, soundEnabled, isRunning]);


    const changeMode = () => {
        const nextMode = mode === "focus"
            ? sessionCount % 2 === 0 ? "shortBreak" : "longBreak"
            : "focus";

        setMode(nextMode);
        setTimeLeft(
            nextMode === "focus" ? focusTime * 60 :
                nextMode === "shortBreak" ? shortBreakTime * 60 : longBreakTime * 60
        );
        if (nextMode === "focus") setSessionCount(prev => prev + 1);
    };

    const { steps, stepIcons, activeStep } = useMemo(() => {
        const stepsList = ["Focus Mind", "Short Break", "Focus Max", "Long Break"];
        const icons = [<Timer />, <Coffee />, <Timer />, <Bedtime />];
        const currentStep = mode === "focus" && sessionCount % 2 === 0 ? 0 :
            mode === "shortBreak" ? 1 :
                mode === "focus" && sessionCount % 2 === 1 ? 2 : 3;
        return { steps: stepsList, stepIcons: icons, activeStep: currentStep };
    }, [mode, sessionCount]);
    return (
        <Box
            textAlign="center"
            p={3}
            borderRadius={3}
            boxShadow={5}
            sx={{
                backgroundColor: mode === "focus" ? "#ff6a88" : mode === "shortBreak" ? "#ff9a8b" : "#64B5F6",
                color: "#fff",
                height: "500px",
                fontFamily: 'Poppins, sans-serif', // Aquí se aplica la tipografía globalmente
            }}>
            <PomodoroStepper activeStep={activeStep} steps={steps} stepIcons={stepIcons} />

            <Box display="flex" justifyContent="center" mt={2}>
                <Button
                    variant="outlined"
                    onClick={() => {
                        if (mode === "focus" && sessionCount % 2 === 0) {
                            setMode("shortBreak");
                            setTimeLeft(shortBreakTime * 60);
                        } else if (mode === "shortBreak") {
                            setMode("focus");
                            setTimeLeft(focusTime * 60);
                            setSessionCount(prev => prev + 1);
                        } else if (mode === "focus" && sessionCount % 2 === 1) {
                            setMode("longBreak");
                            setTimeLeft(longBreakTime * 60);
                        } else if (mode === "longBreak") {
                            setMode("focus");
                            setTimeLeft(focusTime * 60);
                            setSessionCount(prev => prev + 1);
                        }
                    }}
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        borderRadius: "16px",
                        padding: "4px 12px",
                        borderColor: mode === "focus" ? "#8B0000" : mode === "shortBreak" ? "#d4796b" : "#00008B",
                        color: "#fff",
                        backgroundColor: mode === "focus" ? "#ff9a8b33" : mode === "shortBreak" ? "#ff9a8b33" : "#bbdefb33",
                        '&:hover': {
                            backgroundColor: mode === "focus" ? "#ff9a8b55" : mode === "shortBreak" ? "#ff9a8b55" : "#bbdefb55",
                        }
                    }}>
                    {mode === "focus" && <><Timer fontSize="small" sx={{ color: "#fff" }} /> <span style={{ fontWeight: "bold", color: "#fff" }}>Focus</span></>}
                    {mode === "shortBreak" && <><Coffee fontSize="small" sx={{ color: "#fff" }} /> <span style={{ fontWeight: "bold", color: "#fff" }}>Short Break</span></>}
                    {mode === "longBreak" && <><Bedtime fontSize="small" sx={{ color: "#fff" }} /> <span style={{ fontWeight: "bold", color: "#fff" }}>Long Break</span></>}
                </Button>
            </Box>

            <Box textAlign="center">
                <Typography
                    variant="h1"
                    fontWeight="bold"
                    lineHeight={1}
                    sx={{
                        fontSize: "8rem",
                        display: "block",
                        "@media (max-width: 1200px)": { fontSize: "8rem" },
                        "@media (max-width: 900px)": { fontSize: "8rem" },
                        "@media (max-width: 768px)": { fontSize: "8rem", display: "block" },
                        "@media (max-width: 400px)": { fontSize: "8rem" },
                    }}
                >
                    {Math.floor(timeLeft / 60).toString().padStart(2, "0")}
                </Typography>
                <Typography
                    variant="h1"
                    lineHeight={1}
                    sx={{
                        fontSize: "7rem",
                        display: "block",
                        "@media (max-width: 1200px)": { fontSize: "6rem" },
                        "@media (max-width: 900px)": { fontSize: "7rem" },
                        "@media (max-width: 768px)": { fontSize: "7rem", display: "block" },
                        "@media (max-width: 400px)": { fontSize: "7rem" },
                    }}
                >
                    {(timeLeft % 60).toString().padStart(2, "0")}
                </Typography>
            </Box>

            <Box mt={2}>
                <Button variant="contained" onClick={() => setIsRunning(!isRunning)} sx={{ backgroundColor: "rgba(0,0,0,0.4)", color: "#fff" }}>
                    {isRunning ? <Pause /> : <PlayArrow />}
                </Button>
                <Button variant="outlined" onClick={() => setOpenSettings(true)} sx={{ ml: 2, color: "#fff", borderColor: "#fff" }}>
                    <Settings />
                </Button>
                <Dialog open={openSettings} onClose={() => setOpenSettings(false)} fullWidth maxWidth="xs">
                    <DialogTitle>
                        Settings
                        <IconButton onClick={() => setOpenSettings(false)} sx={{ position: "absolute", right: 8, top: 8 }}>
                            <Close />
                        </IconButton>
                    </DialogTitle>
                    <Divider />
                    <DialogContent>
                        <TextField type="number" fullWidth value={focusTime} onChange={(e) => setFocusTime(Number(e.target.value))}
                            margin="dense" variant="outlined" inputProps={{
                                min: 0,
                                style: {
                                    textAlign: "center",
                                    WebkitAppearance: "none",
                                    MozAppearance: "textfield",
                                },
                            }}
                            sx={{
                                backgroundColor: "#ff6a88", borderRadius: 2, border: "none", '& fieldset': { border: 'none' }, '& input': {
                                    textAlign: 'center', color: '#fff', fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)', "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
                                        WebkitAppearance: "none",
                                        margin: 0,
                                    },
                                }
                            }}
                        />
                        <TextField type="number" fullWidth value={shortBreakTime} onChange={(e) => setShortBreakTime(Number(e.target.value))}
                            margin="dense" variant="outlined" inputProps={{
                                min: 0,
                                style: {
                                    textAlign: "center",
                                    WebkitAppearance: "none",
                                    MozAppearance: "textfield",
                                },
                            }}
                            sx={{
                                backgroundColor: "#ff9a8b", borderRadius: 2, border: "none", '& fieldset': { border: 'none' }, '& input': {
                                    textAlign: 'center', color: '#fff', fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)', "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
                                        WebkitAppearance: "none",
                                        margin: 0,
                                    },
                                }
                            }}
                        />
                        <TextField type="number" fullWidth value={longBreakTime} onChange={(e) => setLongBreakTime(Number(e.target.value))}
                            margin="dense" variant="outlined" inputProps={{
                                min: 0,
                                style: {
                                    textAlign: "center",
                                    WebkitAppearance: "none",
                                    MozAppearance: "textfield",
                                },
                            }}
                            sx={{
                                backgroundColor: "#64B5F6", borderRadius: 2, border: "none", '& fieldset': { border: 'none' }, '& input': {
                                    textAlign: 'center', color: '#fff', fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)', "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
                                        WebkitAppearance: "none",
                                        margin: 0,
                                    },
                                }
                            }}
                        />
                        <FormControlLabel
                            control={<Switch checked={soundEnabled} onChange={(e) => setSoundEnabled(e.target.checked)}
                                sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: "#ff6a88" }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: "#ff6a88" } }}
                            />}
                            label="Sound"
                            sx={{ '& .MuiTypography-root': { fontWeight: 'bold', color: '#ff6a88' } }}
                        />
                        <FormControlLabel
                            control={<Switch checked={notificationsEnabled} onChange={(e) => setNotificationsEnabled(e.target.checked)}
                                sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: "#ff6a88" }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: "#ff6a88" } }}
                            />}
                            label="Notifications"
                            sx={{ '& .MuiTypography-root': { fontWeight: 'bold', color: '#ff6a88' } }}
                        />
                    </DialogContent>
                    <Divider />
                    <DialogActions>
                        <Button
                            onClick={() => {
                                const newTime =
                                    mode === "focus" ? focusTime * 60 : mode === "shortBreak" ? shortBreakTime * 60 : longBreakTime * 60

                                setTimeLeft(newTime)

                                setIsRunning(true)

                                setOpenSettings(false)
                            }}
                            variant="contained"
                            sx={{ backgroundColor: "#ff6a88", color: "#fff" }}
                        >
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
                <ToastContainer />
            </Box>
        </Box>
    );
});
