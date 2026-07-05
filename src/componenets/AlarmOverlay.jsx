import pillIcon from '../assets/pill.png'

export default function AlarmOverlay({ activeAlarmMed, onTake, onMute }) {
  if (!activeAlarmMed) return null
  return (
    <div className="absolute inset-0 bg-rose-500/98 backdrop-blur-md z-50 flex flex-col items-center justify-center p-6 text-white text-center space-y-6 transition-all duration-300">
      <div className="relative">
        <div className="absolute -inset-4 bg-white/20 rounded-full blur-md animate-ping"></div>
        <div className="bg-white text-rose-500 p-5 rounded-full shadow-lg relative">
          <img src={pillIcon} alt="Pill Icon" className="w-12 h-12 object-contain animate-bounce" />
        </div>
      </div>
      <div className="space-y-2">
        <span className="bg-white/20 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider animate-pulse">
          🚨 Alarm Active 🚨</span>
        <h2 className="text-2xl font-black tracking-tight">{activeAlarmMed.name}</h2>
        <p className="text-xs opacity-90">Scheduled for {activeAlarmMed.time} on {activeAlarmMed.date}</p>
      </div>

      <div className="flex flex-col w-full gap-3 pt-2">
        <button type="button" onClick={onTake} className="w-full bg-white hover:bg-slate-100 text-rose-600 font-bold py-3.5 rounded-xl shadow-lg transition-all active:scale-[0.98] text-sm cursor-pointer">I Have Taken It
        </button>
        <button type="button" onClick={onMute} className="w-full bg-white/20 hover:bg-white/30 text-white font-medium py-3 rounded-xl transition-all active:scale-[0.98] text-sm cursor-pointer">
          Mute Alarm Sound </button>
      </div>
    </div>
  )
}
