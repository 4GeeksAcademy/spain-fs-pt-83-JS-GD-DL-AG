// src/front/js/component/dashboard/sidebar.js
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'

export const AppSidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

  return (
    <>
      <motion.div
        initial={{ x: -250 }}
        animate={{ x: isSidebarOpen ? 0 : -250 }}
        transition={{ duration: 0.3 }}
        className="fixed left-0 top-0 h-full w-[250px] bg-[#1e1e2e] text-white shadow-lg flex flex-col"
      >
        <div className="flex items-center justify-between p-4">
          <h2 className="text-xl font-bold">Dashboard</h2>
          <IconButton
            onClick={toggleSidebar}
            className="rounded-full bg-[#ff6a88] text-white transition-transform hover:bg-[#e85c7b]"
          >
            <CloseIcon />
          </IconButton>
        </div>
        <div className="flex-grow p-4">
          {/* Add your sidebar content here */}
          <p>Dashboard navigation items</p>
        </div>
        <div className="p-4">
          {/* Add your sidebar footer content here */}
          <p>User info or logout button</p>
        </div>
      </motion.div>

      {/* Button to open sidebar when closed */}
      {!isSidebarOpen && (
        <IconButton
          onClick={toggleSidebar}
          className="fixed left-4 top-4 rounded-full bg-[#ff6a88] text-white transition-transform hover:bg-[#e85c7b]"
        >
          <MenuIcon />
        </IconButton>
      )}
    </>
  )
}