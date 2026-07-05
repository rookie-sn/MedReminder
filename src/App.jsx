import { useState, useEffect } from 'react'
import pillIcon from './assets/pill.png'
import Header from './componenets/Header';
import MedicineForm from './componenets/MedicineForm';
import AlarmOverlay from './componenets/AlarmOverlay';
import ReminderList from './componenets/ReminderList';

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
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  const startAlarmSound = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)() // webaudio API
      const playBeep = () => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.connect(gain)
        gain.connect(ctx.destination)

        osc.type = 'sine'
        osc.frequency.setValueAtTime(900, ctx.currentTime) // (900Hz)
        gain.gain.setValueAtTime(0.6, ctx.currentTime) // 60% volume
        osc.start()
        osc.stop(ctx.currentTime + 0.3) // lasts for 300ms
      }
      playBeep() // loop
      const intervalId = setInterval(playBeep, 800)
      return () => {
        clearInterval(intervalId)
        ctx.close()
      }
    } catch (err) {
      console.error('AudioContext failed:', err)
      return () => {}
    }}

  useEffect(() => {
    if (activeAlarmMed) {alarmStopRef.current = startAlarmSound()
    }
    return () => {
      if (alarmStopRef.current) {alarmStopRef.current()
        alarmStopRef.current = null
      }}
  }, [activeAlarmMed])}
