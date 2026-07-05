import { useEffect, useRef, useState } from 'react'
import pillIcon from './assets/pill.png'
import Header from './componenets/Header'
import MedicineForm from './componenets/MedicineForm'
import AlarmOverlay from './componenets/AlarmOverlay'
import ReminderList from './componenets/ReminderList'

const getTodayString = () => {
  const d = new Date()
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export default function App() {
  const [meds, setMeds] = useState(() => {
    if (typeof window === 'undefined') return []
    const saved = window.localStorage.getItem('medReminders')
    return saved ? JSON.parse(saved) : []
  })
  const [name, setName] = useState('')
  const [date, setDate] = useState(getTodayString())
  const [time, setTime] = useState('')
  const [activeAlarmMed, setActiveAlarmMed] = useState(null)
  const [lastAlarmed, setLastAlarmed] = useState('')
  const alarmStopRef = useRef(null)

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  const startAlarmSound = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      const playBeep = () => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.connect(gain)
        gain.connect(ctx.destination)

        osc.type = 'sine'
        osc.frequency.setValueAtTime(900, ctx.currentTime)
        gain.gain.setValueAtTime(0.6, ctx.currentTime)
        osc.start()
        osc.stop(ctx.currentTime + 0.3)
      }

      playBeep()
      const intervalId = window.setInterval(playBeep, 800)

      return () => {
        window.clearInterval(intervalId)
        ctx.close()
      }
    } catch (err) {
      console.error('AudioContext failed:', err)
      return () => {}
    }
  }

  useEffect(() => {
    if (activeAlarmMed) {
      alarmStopRef.current = startAlarmSound()
    }

    return () => {
      if (alarmStopRef.current) {
        alarmStopRef.current()
        alarmStopRef.current = null
      }
    }
  }, [activeAlarmMed])

  useEffect(() => {
    const interval = window.setInterval(() => {
      const now = new Date()
      const year = now.getFullYear()
      const month = String(now.getMonth() + 1).padStart(2, '0')
      const day = String(now.getDate()).padStart(2, '0')
      const currentDateStr = `${year}-${month}-${day}`
      const currentHHMM = now.toTimeString().slice(0, 5)
      const timeKey = `${currentDateStr} ${currentHHMM}`

      if (timeKey !== lastAlarmed) {
        const activeMed = meds.find(
          (med) => med.date === currentDateStr && med.time === currentHHMM && !med.taken
        )
        if (activeMed) {
          setLastAlarmed(timeKey)
          setActiveAlarmMed(activeMed)
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Medicine Reminder', {
              body: `It is time to take your ${activeMed.name}!`,
              icon: pillIcon,
            })
          }
        }
      }
    }, 1000)
    return () => window.clearInterval(interval)
  }, [meds, lastAlarmed])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('medReminders', JSON.stringify(meds))
    }
  }, [meds])
  const addMedicine = (e) => {
    e.preventDefault()
    if (!name.trim() || !date || !time) return
    const newMed = {
      id: Date.now(),
      name: name.trim(),
      date,
      time,
      taken: false,
    }
    setMeds((prev) => [...prev, newMed])
    setName('')
    setDate(getTodayString())
    setTime('')
  }
  const toggleTaken = (id) => {
    setMeds((prev) => prev.map((med) => (med.id === id ? { ...med, taken: !med.taken } : med)))
  }
  const deleteMedicine = (id) => {
    setMeds((prev) => prev.filter((med) => med.id !== id))
    if (activeAlarmMed && activeAlarmMed.id === id) {
      setActiveAlarmMed(null)
    }
  }
  const muteAlarm = () => {
    setActiveAlarmMed(null)
  }
  const takeMedicineFromAlarm = () => {
    if (activeAlarmMed) {
      toggleTaken(activeAlarmMed.id)
      setActiveAlarmMed(null)
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-slate-50 to-indigo-100 p-4 sm:p-6 flex flex-col items-center justify-center text-slate-800">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-indigo-50/50 p-6 sm:p-8 space-y-6 relative overflow-hidden">
        <AlarmOverlay activeAlarmMed={activeAlarmMed} onTake={takeMedicineFromAlarm} onMute={muteAlarm} />
        <Header />
        <MedicineForm
          name={name}
          setName={setName}
          date={date}
          setDate={setDate}
          time={time}
          setTime={setTime}
          onSubmit={addMedicine}
        />
        <hr className="border-slate-100" />
        <ReminderList meds={meds} onToggleTaken={toggleTaken} onDelete={deleteMedicine} />
      </div>
    </div>
  )
}

