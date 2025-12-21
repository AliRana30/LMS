"use client"
import React, { useState } from 'react'
import DashboardHeader from './DashboardHeader'
import DashboardWidgets from '../../components/Admin/Widgets/DashboardWidgets'

type Props = {
  isDashboard?: boolean
  onMenuClick?: () => void
}

const DashboardHero = ({ isDashboard, onMenuClick }: Props) => {
  const [open , setOpen] = useState(false);
  return (
    <div>
      <DashboardHeader open={open} setOpen={setOpen} onMenuClick={onMenuClick}/>
        {
          isDashboard && (
              <DashboardWidgets open={open}/>
          )
        }
    </div>
  )
}

export default DashboardHero
