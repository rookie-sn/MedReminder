import { useState, useEffect, useRef } from 'react'
import pillIcon from './assets/pill.png'
import Header from './componenets/Header';

const getTodayString = () => {
  const d = new Date()
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export default function App() {
    
  const [meds, setMeds] = useState(() => {
    const saved = localStorage.getItem('medReminders')
    return saved ? JSON.parse(saved) : []
  })

  const [name, setName] = useState('')
  const [date, setDate] = useState(getTodayString())
  const [time, setTime] = useState('')
  const [lastAlarmed, setLastAlarmed] = useState('')
  const [activeAlarmMed, setActiveAlarmMed] = useState(null)
  const alarmStopRef = useRef(null)

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])
}