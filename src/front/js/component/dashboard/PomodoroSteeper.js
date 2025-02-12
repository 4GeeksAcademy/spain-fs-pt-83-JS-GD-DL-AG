import React from "react"
import { Stepper, Step, StepLabel } from "@mui/material"
import { styled } from "@mui/system"

const StyledStepLabel = styled(StepLabel)(({ theme, isActive }) => ({
    // Asegurarse de que el texto siempre sea blanco
    "& .MuiStepLabel-label": {
      fontFamily: "Poppins, sans-serif",
      color: "white !important", // Forzar color blanco
      opacity: isActive ? 1 : 0.7, // Usar opacidad para diferenciar estados
      fontWeight: isActive ? "bold" : "normal",
      transition: "all 0.2s ease",
    },
    "& .MuiStepLabel-iconContainer": {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      transition: "transform 0.2s ease",
      ...(isActive && {
        animation: "pulse 1.5s infinite",
        transform: "scale(1.2)",
      }),
    },
    "@keyframes pulse": {
      "0%": {
        transform: "scale(1)",
      },
      "50%": {
        transform: "scale(1.2)",
      },
      "100%": {
        transform: "scale(1)",
      },
    },
  }))

export const PomodoroStepper = ({ activeStep, steps, stepIcons }) => {
  return (
    <Stepper activeStep={activeStep} alternativeLabel>
      {steps.map((label, index) => (
        <Step key={label}>
          <StyledStepLabel isActive={activeStep === index} StepIconComponent={() => stepIcons[index]}>
            {label}
          </StyledStepLabel>
        </Step>
      ))}
    </Stepper>
  )
}

