import React, { useMemo } from "react"
import { motion } from "framer-motion"
import { styled } from "@mui/system"

const CustomStepIcon = styled(motion.div)(({ theme }) => ({
  width: 42,
  height: 42,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "50%",
  fontSize: "1.2rem",
  color: "#fff",
  position: "relative",
  overflow: "hidden",
}))

const PulseOverlay = styled(motion.div)({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  borderRadius: "50%",
  backgroundColor: "rgba(255, 255, 255, 0.3)",
})

export const MotionStepIcon = React.memo(({ isCompleted, isActive, children }) => {
  
  const variants = useMemo(() => ({
    completed: {
      backgroundColor: "rgba(56, 177, 110, 0.8)",
      boxShadow: "0 0 5px rgba(81, 209, 138, 0.8)",
    },
    active: {
      backgroundColor: "#ff2259",
      boxShadow: "0 0 10px rgba(255, 61, 126, 0.8)",
    },
    inactive: {
      backgroundColor: "#5a5a5a",
      boxShadow: "none",
    },
  }), [])

  const pulseVariants = useMemo(() => ({
    pulse: {
      scale: [1, 1.2, 1],
      opacity: [0, 0.5, 0],
      transition: {
        duration: 3,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
  }), [])

  return (
    <CustomStepIcon
      variants={variants}
      initial={isCompleted ? "completed" : "inactive"}
      animate={isActive ? "active" : isCompleted ? "completed" : "inactive"}
      transition={{
        duration: 0.3,
        ease: "easeInOut",
      }}
    >
      {isActive && <PulseOverlay variants={pulseVariants} initial="pulse" animate="pulse" />}
      {children}
    </CustomStepIcon>
  )
})
