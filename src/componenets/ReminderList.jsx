import checkIcon from '../assets/check.png'
import trashIcon from '../assets/trash.png'

const formatLocalDate = (dateStr) => {
  try {
    const parts = dateStr.split('-')
    if (parts.length === 3) {
      const localDate = new Date(parts[0], parts[1] - 1, parts[2])
      const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }
      return localDate.toLocaleDateString(undefined, options)
    }
    return dateStr
  } catch (e) {
    return dateStr
  }}

export default function ReminderList({ meds, onToggleTaken, onDelete }) {
  const sortedMeds = [...meds].sort((a, b) => {
    const dateCompare = a.date.localeCompare(b.date)
    if (dateCompare !== 0) return dateCompare
    return a.time.localeCompare(b.time)
  })
  const groupedByDate = sortedMeds.reduce((groups, med) => {
    const key = med.date
    if (!groups[key]) {
        groups[key] = []}
    groups[key].push(med)
    return groups
  }, {})
  return (
    <div className="space-y-3">
      <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Scheduled Reminders</h2>
      {meds.length === 0 ? ( //if null or empty
        <div className="text-center py-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <p className="text-sm text-slate-500 font-medium">All clear! No reminders set.</p>
          <p className="text-xs text-slate-400 mt-0.5">Use the form above to add one.</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
          {Object.entries(groupedByDate).map(([date, dateMeds]) => (
            <div key={date} className="space-y-2">
              <div className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg inline-flex items-center gap-1 select-none">
                <span>📅</span> {formatLocalDate(date)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

