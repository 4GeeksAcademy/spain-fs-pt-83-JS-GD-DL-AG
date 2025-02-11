import React, { createContext, useContext, useState, useEffect } from 'react';

const PomodoroContext = createContext();

export const usePomodoro = () => useContext(PomodoroContext);

export const PomodoroProvider = ({ children }) => {
    // Inicializamos los estados
    const [focusTime, setFocusTime] = useState(25);
    const [shortBreakTime, setShortBreakTime] = useState(5);
    const [longBreakTime, setLongBreakTime] = useState(15);
    const [timeLeft, setTimeLeft] = useState(focusTime * 60);
    const [isRunning, setIsRunning] = useState(false);
    const [mode, setMode] = useState("focus");
    const [sessionCount, setSessionCount] = useState(0);
    const [soundEnabled, setSoundEnabled] = useState(false);
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);

    // Cargar configuraciones de localStorage SOLO la primera vez que se monta el componente
    useEffect(() => {
        const savedFocusTime = JSON.parse(localStorage.getItem("focusTime"));
        const savedShortBreakTime = JSON.parse(localStorage.getItem("shortBreakTime"));
        const savedLongBreakTime = JSON.parse(localStorage.getItem("longBreakTime"));
        const savedSoundEnabled = JSON.parse(localStorage.getItem("soundEnabled"));
        const savedNotificationsEnabled = JSON.parse(localStorage.getItem("notificationsEnabled"));
        const savedTimeLeft = JSON.parse(localStorage.getItem("timeLeft"));

        // Solo actualizar el estado si no existe el valor en localStorage
        if (savedFocusTime) setFocusTime(savedFocusTime);
        if (savedShortBreakTime) setShortBreakTime(savedShortBreakTime);
        if (savedLongBreakTime) setLongBreakTime(savedLongBreakTime);
        if (savedSoundEnabled !== null) setSoundEnabled(savedSoundEnabled);
        if (savedNotificationsEnabled !== null) setNotificationsEnabled(savedNotificationsEnabled);
        if (savedTimeLeft !== null) {
            setTimeLeft(savedTimeLeft);
        }
    }, []); // Este useEffect solo se ejecuta al montar el componente

    // Guardar configuraciones y timeLeft en localStorage solo cuando cambian
    useEffect(() => {
        localStorage.setItem("focusTime", JSON.stringify(focusTime));
        localStorage.setItem("shortBreakTime", JSON.stringify(shortBreakTime));
        localStorage.setItem("longBreakTime", JSON.stringify(longBreakTime));
        localStorage.setItem("soundEnabled", JSON.stringify(soundEnabled));
        localStorage.setItem("notificationsEnabled", JSON.stringify(notificationsEnabled));
        localStorage.setItem("timeLeft", JSON.stringify(timeLeft)); // Guardar timeLeft en localStorage
    }, [focusTime, shortBreakTime, longBreakTime, soundEnabled, notificationsEnabled, timeLeft]); // Este useEffect se ejecuta cuando cualquier estado cambia

    // Reducir el tiempo de timeLeft mientras esté en ejecución
    useEffect(() => {
        let interval;
        if (isRunning) {
            interval = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev > 0) {
                        const newTimeLeft = prev - 1;
                        localStorage.setItem("timeLeft", JSON.stringify(newTimeLeft));  // Guardar en localStorage
                        return newTimeLeft;
                    } else {
                        clearInterval(interval);
                        return prev;
                    }
                });
            }, 1000);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isRunning]);

    return (
        <PomodoroContext.Provider value={{
            focusTime, setFocusTime,
            shortBreakTime, setShortBreakTime,
            longBreakTime, setLongBreakTime,
            timeLeft, setTimeLeft,
            isRunning, setIsRunning,
            mode, setMode,
            sessionCount, setSessionCount,
            soundEnabled, setSoundEnabled,
            notificationsEnabled, setNotificationsEnabled
        }}>
            {children}
        </PomodoroContext.Provider>
    );
};
