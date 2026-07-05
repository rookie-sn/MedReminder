import pillIcon from '../assets/pill.png'

export default function Header() {
  return (
    <div className="flex items-center gap-3">
      <div className="bg-indigo-50 p-2 rounded-xl flex-shrink-0">
        <img src={pillIcon} alt="Pill Icon" className="w-10 h-10 object-contain" />
      </div>
      <div>
        <h1 className="text-xl font-bold text-slate-900">Medicine Reminder</h1>
        <p className="text-xs text-slate-500">Add your Medicines for reminder</p>
      </div>
    </div>
  )
}
